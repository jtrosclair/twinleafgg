"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShayminEx2ROS = exports.VsSeekerSVROS = exports.EnergySwitchPKROS = exports.Winona2ROS = exports.Wally2ROS = exports.ShayminEx3ROS = exports.MRayquazaEx3ROS = exports.RayquazaEx3ROS = exports.UltraBallROS = exports.SwitchROS = exports.ReviveROS = exports.TrainersMailROS = void 0;
const revive_1 = require("../set-base-set/revive");
const switch_1 = require("../set-base-set/switch");
const ultra_ball_1 = require("../set-scarlet-and-violet/ultra-ball");
const rayquaza_ex_1 = require("../set-roaring-skies/rayquaza-ex");
const mega_rayquaza_ex_1 = require("../set-roaring-skies/mega-rayquaza-ex");
const shaymin_ex_1 = require("../set-roaring-skies/shaymin-ex");
const wally_1 = require("../set-roaring-skies/wally");
const winona_1 = require("../set-roaring-skies/winona");
const other_prints_1 = require("../set-ex-power-keepers/other-prints");
const other_prints_2 = require("../set-supreme-victors/other-prints");
const trainers_mail_1 = require("./trainers-mail");
class TrainersMailROS extends trainers_mail_1.TrainersMail {
    constructor() {
        super(...arguments);
        this.set = 'ROS';
        this.setNumber = '92a';
        this.fullName = 'Trainers Mail ROS 92a';
    }
}
exports.TrainersMailROS = TrainersMailROS;
class ReviveROS extends revive_1.Revive {
    constructor() {
        super(...arguments);
        this.setNumber = '88';
        this.fullName = 'Revive ROS';
        this.set = 'ROS';
    }
}
exports.ReviveROS = ReviveROS;
class SwitchROS extends switch_1.Switch {
    constructor() {
        super(...arguments);
        this.setNumber = '91';
        this.fullName = 'Switch ROS';
        this.set = 'ROS';
    }
}
exports.SwitchROS = SwitchROS;
class UltraBallROS extends ultra_ball_1.UltraBall {
    constructor() {
        super(...arguments);
        this.setNumber = '93';
        this.fullName = 'Ultra Ball ROS';
        this.set = 'ROS';
    }
}
exports.UltraBallROS = UltraBallROS;
class RayquazaEx3ROS extends rayquaza_ex_1.RayquazaEx {
    constructor() {
        super(...arguments);
        this.setNumber = '104';
        this.fullName = 'Rayquaza EX3 ROS';
        this.set = 'ROS';
    }
}
exports.RayquazaEx3ROS = RayquazaEx3ROS;
class MRayquazaEx3ROS extends mega_rayquaza_ex_1.MRayquazaEx {
    constructor() {
        super(...arguments);
        this.setNumber = '105';
        this.fullName = 'M Rayquaza-EX3 ROS';
        this.set = 'ROS';
    }
}
exports.MRayquazaEx3ROS = MRayquazaEx3ROS;
class ShayminEx3ROS extends shaymin_ex_1.ShayminEx {
    constructor() {
        super(...arguments);
        this.setNumber = '106';
        this.fullName = 'Shaymin EX3 ROS';
        this.set = 'ROS';
    }
}
exports.ShayminEx3ROS = ShayminEx3ROS;
class Wally2ROS extends wally_1.Wally {
    constructor() {
        super(...arguments);
        this.setNumber = '107';
        this.fullName = 'Wally2 ROS';
        this.set = 'ROS';
    }
}
exports.Wally2ROS = Wally2ROS;
class Winona2ROS extends winona_1.Winona {
    constructor() {
        super(...arguments);
        this.setNumber = '108';
        this.fullName = 'Winona2 ROS';
        this.set = 'ROS';
    }
}
exports.Winona2ROS = Winona2ROS;
class EnergySwitchPKROS extends other_prints_1.EnergySwitchPK {
    constructor() {
        super(...arguments);
        this.setNumber = '109';
        this.fullName = 'Energy Switch ROS';
        this.set = 'ROS';
    }
}
exports.EnergySwitchPKROS = EnergySwitchPKROS;
class VsSeekerSVROS extends other_prints_2.VsSeekerSV {
    constructor() {
        super(...arguments);
        this.setNumber = '110';
        this.fullName = 'VS Seeker ROS';
        this.set = 'ROS';
    }
}
exports.VsSeekerSVROS = VsSeekerSVROS;
class ShayminEx2ROS extends shaymin_ex_1.ShayminEx {
    constructor() {
        super(...arguments);
        this.setNumber = '77a';
        this.fullName = 'Shaymin EX2 ROS';
        this.set = 'ROS';
    }
}
exports.ShayminEx2ROS = ShayminEx2ROS;
