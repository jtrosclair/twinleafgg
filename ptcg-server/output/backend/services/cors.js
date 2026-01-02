"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = void 0;
const config_1 = require("../../config");
function cors() {
    return function (req, res, next) {
        const allowedOrigins = [
            'https://play.twinleaf.gg',
            'http://localhost:4200'
        ];
        const origin = req.headers.origin;
        if (config_1.config.backend.allowCors && origin && allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Origin', origin);
        }
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST');
        res.header('Access-Control-Allow-Headers', [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Auth-Token'
        ].join(','));
        next();
    };
}
exports.cors = cors;
