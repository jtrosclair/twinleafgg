"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickBallFST = exports.JudgeFST = void 0;
const judge_1 = require("../set-scarlet-and-violet/judge");
const quick_ball_1 = require("../set-sword-and-shield/quick-ball");
class JudgeFST extends judge_1.Judge {
    constructor() {
        super(...arguments);
        this.set = 'FST';
        this.setNumber = '235';
        this.fullName = 'Judge FST';
    }
}
exports.JudgeFST = JudgeFST;
class QuickBallFST extends quick_ball_1.QuickBall {
    constructor() {
        super(...arguments);
        this.set = 'FST';
        this.setNumber = '237';
        this.fullName = 'Quick Ball FST';
    }
}
exports.QuickBallFST = QuickBallFST;
