"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketWrapper = void 0;
class SocketWrapper {
    constructor(io, socket) {
        this.listeners = [];
        this.io = io;
        this.socket = socket;
    }
    attachListeners() {
        for (let i = 0; i < this.listeners.length; i++) {
            const listener = this.listeners[i];
            this.socket.on(listener.message, listener.boundHandler);
        }
    }
    addListener(message, handler) {
        const boundHandler = async (data, fn) => {
            const response = (message, data) => fn && fn({ message, data });
            try {
                await handler(data, response);
            }
            catch (error) {
                response('error', error.message);
            }
        };
        const listener = { message, handler, boundHandler };
        this.listeners.push(listener);
    }
    removeListener(message) {
        const index = this.listeners.findIndex(l => l.message === message);
        if (index !== -1) {
            const listener = this.listeners[index];
            this.socket.off(listener.message, listener.boundHandler);
            this.listeners.splice(index, 1);
        }
    }
    emit(event, ...args) {
        return this.socket.emit(event, ...args);
    }
}
exports.SocketWrapper = SocketWrapper;
