export class Base64 {
  public encode(s: string): string {
    // Encode string as UTF-8 bytes, then base64 encode
    const utf8Bytes = new TextEncoder().encode(s);
    let binary = '';
    // Keep argument lists small enough for mobile WebViews without allocating
    // one intermediate JavaScript string for every input byte.
    for (let offset = 0; offset < utf8Bytes.length; offset += 8192) {
      binary += String.fromCharCode(...utf8Bytes.subarray(offset, offset + 8192));
    }
    return btoa(binary);
  }

  public decode(s: string): string {
    // Decode base64 to bytes, then interpret as UTF-8 string
    const binary = atob(s);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new TextDecoder().decode(bytes);
  }
}
