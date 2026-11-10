// Read-only compatibility API for the PrizeMap editor. The deck parser is
// extracted from the former simulator server; no server or database is needed.
import { ensureClientCards } from '../ptcg-server/src/client/cards';
import { StateSerializer } from '../ptcg-server/src/game/serializer/state-serializer';
import { Base64 } from '../ptcg-server/src/utils/base64';
import { DeckImportParser } from './deck-import';

// Snapshot of the same public image map used by the old endpoint. It includes
// keys for unknown cards; refresh it explicitly when rebuilding the service.
import imageUrls from './large-card-images.json';
const MAX_STATE_BYTES = 8 * 1024 * 1024;
const MAX_STATE_BASE64_CHARS = 4 * Math.ceil(MAX_STATE_BYTES / 3);
const MAX_VALIDATION_BODY_BYTES = 12 * 1024 * 1024;
const MAX_DECK_BODY_BYTES = 256 * 1024;
const MAX_DECK_CHARS = 100_000;
const MAX_DECK_LINES = 1000;
const MAX_CARDS = 1000;
const imageMap = new Map<string, string>(Object.entries(imageUrls));

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'cache-control': 'no-store'
  } });
}

async function bodyFor(request: Request, maxBytes: number): Promise<any> {
  if (Number(request.headers.get('content-length')) > maxBytes) throw new RangeError('Request body too large');
  if (!request.body) throw new SyntaxError('Invalid JSON');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > maxBytes) { await reader.cancel(); throw new RangeError('Request body too large'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

function validateState(stateData: unknown): Response {
  if (!stateData || typeof stateData !== 'string') {
    return json({ ok: false, valid: false, error: 'INVALID_REQUEST', message: 'stateData is required and must be a string' }, 400);
  }
  if (stateData.length > MAX_STATE_BASE64_CHARS) return json({ ok: false, valid: false, error: 'REQUEST_TOO_LARGE' }, 413);
  let serializedState: string;
  const base64 = new Base64();
  try {
    const binary = atob(stateData);
    if (binary.length > MAX_STATE_BYTES) return json({ ok: false, valid: false, error: 'REQUEST_TOO_LARGE' }, 413);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    serializedState = new TextDecoder().decode(bytes);
  } catch (error) { return json({ ok: false, valid: false, error: 'INVALID_BASE64', message: 'Failed to decode base64 string: ' + ((error as Error).message || 'Invalid base64') }, 400); }
  try {
    const parsed = JSON.parse(serializedState);
    if (parsed[1] && Array.isArray(parsed[1].cardNames)) {
      parsed[1].cardNames = parsed[1].cardNames.map((name: string) => {
        // Preserve executable print identities exactly as ClientSimulator does.
        // Legacy normalization remains necessary for external/old card names.
        if (StateSerializer.hasKnownCard(name)) return name;
        name = name.replace('é', 'e');
        return StateSerializer.normalizeCardName(name) || name;
      });
      serializedState = JSON.stringify(parsed);
    }
  } catch (error) { return json({ ok: false, valid: false, error: 'INVALID_JSON', message: 'Failed to parse state JSON: ' + ((error as Error).message || 'Invalid JSON') }, 400); }
  try {
    const state = new StateSerializer().deserialize(serializedState);
    return json({ ok: true, valid: true, serializedState: base64.encode(serializedState), info: {
      turn: state.turn, phase: state.phase, playerCount: state.players.length, state
    } });
  } catch (error) {
    const message = (error as Error).message || 'Failed to deserialize game state';
    return json({ ok: false, valid: false, error: message.includes('Unknown card') ? 'UNKNOWN_CARD' : 'INVALID_STATE', message }, 400);
  }
}

export async function handle(request: Request): Promise<Response> {
  const route = new URL(request.url).pathname;
  if (!['/v1/deck-import/parse', '/v1/deck-import/get-cards', '/v1/game/validate-state'].includes(route)) return json({ ok: false, error: 'NOT_FOUND' }, 404);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type' } });
  if (request.method !== 'POST') return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405);
  let input: any;
  try { input = await bodyFor(request, route === '/v1/game/validate-state' ? MAX_VALIDATION_BODY_BYTES : MAX_DECK_BODY_BYTES); }
  catch (error) { return json({ ok: false, error: error instanceof RangeError ? 'REQUEST_TOO_LARGE' : 'INVALID_JSON' }, error instanceof RangeError ? 413 : 400); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return json({ ok: false, error: 'INVALID_REQUEST' }, 400);
  if (route === '/v1/deck-import/parse' && (!input.deckList || typeof input.deckList !== 'string')) return json({ ok: false, error: 'deckList is required and must be a string' }, 400);
  if (route === '/v1/deck-import/parse' && (input.deckList.length > MAX_DECK_CHARS || input.deckList.split('\n').length > MAX_DECK_LINES)) return json({ ok: false, error: 'REQUEST_TOO_LARGE' }, 413);
  if (route === '/v1/deck-import/get-cards' && (!Array.isArray(input.cards) || input.cards.some((card: unknown) => typeof card !== 'string'))) return json({ ok: false, error: 'cards is required and must be an array of strings' }, 400);
  if (route === '/v1/deck-import/get-cards' && input.cards.length > MAX_CARDS) return json({ ok: false, error: 'REQUEST_TOO_LARGE' }, 413);
  try {
    ensureClientCards();
    if (route === '/v1/game/validate-state') return validateState(input.stateData);
    const parser = new DeckImportParser(imageMap);
    return json(route === '/v1/deck-import/parse' ? parser.parseDeckList(input.deckList) : parser.getCards(input.cards));
  } catch (error) {
    console.error('Simulator API failed:', error);
    return json({ ok: false, error: 'INTERNAL_ERROR' }, 500);
  }
}

export default { fetch: handle };
