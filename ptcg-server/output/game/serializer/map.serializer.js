"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapSerializer = void 0;
class MapSerializer {
    constructor() {
        this.types = ['Map'];
        this.classes = [Map];
    }
    serialize(map) {
        try {
            // Check if it's actually a Map instance and has the entries method
            if (map instanceof Map && typeof map.entries === 'function') {
                return {
                    _type: 'Map',
                    entries: Array.from(map.entries())
                };
            }
            // Fallback: if it's not a proper Map, try to convert it
            if (map && typeof map === 'object') {
                const entries = [];
                // If it has a forEach method (like Map), use it
                if (typeof map.forEach === 'function') {
                    map.forEach((value, key) => {
                        entries.push([key, value]);
                    });
                }
                else {
                    // Otherwise, treat it as a regular object
                    for (const [key, value] of Object.entries(map)) {
                        entries.push([key, value]);
                    }
                }
                return {
                    _type: 'Map',
                    entries: entries
                };
            }
            // If all else fails, return empty Map
            return {
                _type: 'Map',
                entries: []
            };
        }
        catch (error) {
            console.error('Error serializing Map:', error);
            return {
                _type: 'Map',
                entries: []
            };
        }
    }
    deserialize(serialized, context) {
        const map = new Map();
        if (serialized.entries && Array.isArray(serialized.entries)) {
            try {
                for (const [key, value] of serialized.entries) {
                    map.set(key, value);
                }
            }
            catch (error) {
                console.error('Error deserializing Map entries:', error);
            }
        }
        return map;
    }
}
exports.MapSerializer = MapSerializer;
