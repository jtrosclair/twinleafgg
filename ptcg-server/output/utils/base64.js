"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base64 = void 0;
class Base64 {
    encode(s) {
        // Encode string as UTF-8 bytes, then base64 encode
        const utf8Bytes = new TextEncoder().encode(s);
        const binary = Array.from(utf8Bytes, (byte) => String.fromCodePoint(byte)).join('');
        return btoa(binary);
    }
    decode(s) {
        // Decode base64 to bytes, then interpret as UTF-8 string
        const binary = atob(s);
        const bytes = Uint8Array.from(binary, (b) => b.charCodeAt(0));
        return new TextDecoder().decode(bytes);
    }
}
exports.Base64 = Base64;
