"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const services_1 = require("../services");
const controller_1 = require("./controller");
const storage_1 = require("../../storage");
const rate_limit_1 = require("../common/rate-limit");
const config_1 = require("../../config");
class Login extends controller_1.Controller {
    constructor() {
        super(...arguments);
        this.rateLimit = rate_limit_1.RateLimit.getInstance();
    }
    async onRegister(req, res, next) {
        const body = req.body;
        res.send({ ok: true });
    }
    async onLogin(req, res) {
        res.send({
            ok: true
        });
    }
    async onRefreshToken(req, res) {
        const userId = req.body.userId;
        const token = (0, services_1.generateToken)(userId);
        res.send({ ok: true, token, config: this.getServerConfig() });
    }
    onLogout(req, res) {
        res.send({ ok: true });
    }
    onInfo(req, res) {
        res.send({ ok: true, config: this.getServerConfig() });
    }
    async onAnonymousLogin(req, res) {
        // Create and persist an anonymous user to the database
        const anonymousName = `Guest_${Math.random().toString(36).substring(2, 15)}`;
        const user = new storage_1.User();
        user.name = anonymousName;
        user.roleId = 2; // Regular user role
        user.registered = Date.now();
        const updatedUser = await user.save();
        const token = (0, services_1.generateToken)(user.id);
        res.send({
            ok: true,
            token,
            config: this.getServerConfig(),
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                roleId: updatedUser.roleId,
                isAnonymous: true
            }
        });
    }
    getServerConfig() {
        return {
            apiVersion: 2,
            defaultPageSize: config_1.config.backend.defaultPageSize,
            scansUrl: config_1.config.sets.scansUrl,
            avatarsUrl: config_1.config.backend.avatarsUrl,
            avatarFileSize: config_1.config.backend.avatarFileSize,
            avatarMinSize: config_1.config.backend.avatarMinSize,
            avatarMaxSize: config_1.config.backend.avatarMaxSize,
            replayFileSize: config_1.config.backend.replayFileSize,
            refreshTokenInterval: config_1.config.backend.refreshTokenInterval
        };
    }
}
__decorate([
    (0, controller_1.Post)('/register'),
    (0, services_1.Validate)({
        name: (0, services_1.check)().isName(),
        email: (0, services_1.check)().isEmail(),
        password: (0, services_1.check)().isPassword()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], Login.prototype, "onRegister", null);
__decorate([
    (0, controller_1.Post)(''),
    (0, services_1.Validate)({
        name: (0, services_1.check)().isName(),
        password: (0, services_1.check)().isString()
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Login.prototype, "onLogin", null);
__decorate([
    (0, controller_1.Get)('/refreshToken'),
    (0, services_1.AuthToken)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Login.prototype, "onRefreshToken", null);
__decorate([
    (0, controller_1.Get)('/logout'),
    (0, services_1.AuthToken)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Login.prototype, "onLogout", null);
__decorate([
    (0, controller_1.Get)('/info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Login.prototype, "onInfo", null);
__decorate([
    (0, controller_1.Post)('/anonymous'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Login.prototype, "onAnonymousLogin", null);
exports.Login = Login;
