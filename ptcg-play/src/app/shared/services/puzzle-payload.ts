import { decodePuzzleFieldCodes, MAX_FIELD_CODE_JSON_BYTES } from './puzzle-field-codes';

// Import only the inflate core: compression is performed by the puzzle producer.
// Pinned pako supports the app's iOS 15 WebViews, including offline packages.
const inflateCore = require('pako/lib/zlib/inflate.js');
const ZStream = require('pako/lib/zlib/zstream.js');

export const GZIP_PUZZLE_PREFIX = 'gz1.';
export const FIELD_CODE_PUZZLE_PREFIX = 'gz2.';
export const MAX_COMPRESSED_PUZZLE_BYTES = 1024 * 1024;
export const MAX_EXPANDED_PUZZLE_BYTES = MAX_FIELD_CODE_JSON_BYTES;

/** Decode initial URL transport only. Engine/history snapshots remain Base64. */
export function decodePuzzlePayload(stateData: string): string {
  const fieldCodes = stateData.startsWith(FIELD_CODE_PUZZLE_PREFIX);
  if (!fieldCodes && !stateData.startsWith(GZIP_PUZZLE_PREFIX)) {
    if (/^gz\d+\./.test(stateData)) {
      throw new Error('Unsupported compressed puzzle version.');
    }
    return stateData;
  }

  const encoded = stateData.slice(GZIP_PUZZLE_PREFIX.length);
  if (encoded.length > Math.ceil(MAX_COMPRESSED_PUZZLE_BYTES * 4 / 3)) {
    throw new Error('Compressed puzzle is too large.');
  }
  if (!/^[A-Za-z0-9_-]+$/.test(encoded) || encoded.length % 4 === 1) {
    throw new Error('Invalid compressed puzzle encoding.');
  }
  const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
  if (binary.length > MAX_COMPRESSED_PUZZLE_BYTES) {
    throw new Error('Compressed puzzle is too large.');
  }
  // Reject noncanonical unused bits as well as padding/standard-Base64 symbols.
  if (btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') !== encoded) {
    throw new Error('Invalid compressed puzzle encoding.');
  }
  const input = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) {
    input[index] = binary.charCodeAt(index);
  }

  const stream = new ZStream();
  // 31 = gzip only. The core verifies header, CRC32 and uncompressed length.
  if (inflateCore.inflateInit2(stream, 31) !== 0) {
    throw new Error('Could not initialize compressed puzzle decoder.');
  }
  stream.input = input;
  stream.avail_in = input.length;
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      // Allow one extra byte to detect a limit violation without trusting ISIZE.
      stream.output = new Uint8Array(Math.min(16384, MAX_EXPANDED_PUZZLE_BYTES - length + 1));
      stream.next_out = 0;
      stream.avail_out = stream.output.length;
      const beforeInput = stream.avail_in;
      const status = inflateCore.inflate(stream, 0); // Z_NO_FLUSH
      length += stream.next_out;
      if (length > MAX_EXPANDED_PUZZLE_BYTES) {
        throw new Error('Expanded puzzle is too large.');
      }
      if (stream.next_out) {
        chunks.push(stream.output.subarray(0, stream.next_out));
      }
      if (status === 1) { // Z_STREAM_END, including verified gzip trailer
        if (stream.avail_in !== 0) {
          throw new Error('Compressed puzzle contains trailing data.');
        }
        break;
      }
      if (status !== 0 || (beforeInput === stream.avail_in && stream.next_out === 0)) {
        throw new Error('Invalid or incomplete compressed puzzle.');
      }
    }
  } finally {
    inflateCore.inflateEnd(stream);
  }

  const output = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  // Validate without replacement characters; preserve the exact UTF-8 bytes.
  const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(output);
  const plain = fieldCodes ? new TextEncoder().encode(decodePuzzleFieldCodes(text)) : output;
  let decoded = '';
  for (let index = 0; index < plain.length; index += 8192) {
    decoded += String.fromCharCode(...plain.subarray(index, index + 8192));
  }
  return btoa(decoded);
}
