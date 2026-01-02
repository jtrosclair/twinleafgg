"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonCatcherDEX = exports.ArcheopsDEX = exports.TornadusEx2DEX = exports.RaikouEx2DEX = exports.UltraBallDEX = exports.NDEX = exports.CherenDEX = exports.RareCandyDEX = exports.ProfessorJuniperDEX = exports.EnhancedHammerDEX = exports.DarkraiExDEX = exports.DarkPatchDEX = void 0;
const cheren_1 = require("../set-emerging-powers/cheren");
const n_1 = require("../set-fates-collide/n");
const ultra_ball_1 = require("../set-scarlet-and-violet/ultra-ball");
const raikou_ex_1 = require("../set-dark-explorers/raikou-ex");
const tornadus_ex_1 = require("../set-dark-explorers/tornadus-ex");
const archeops_1 = require("../set-noble-victories/archeops");
const pokemon_catcher_1 = require("../set-emerging-powers/pokemon-catcher");
const dark_patch_1 = require("../set-astral-radiance/dark-patch");
const darkrai_ex_1 = require("./darkrai-ex");
const enhanced_hammer_1 = require("../set-twilight-masquerade/enhanced-hammer");
const professor_juniper_1 = require("../set-black-and-white/professor-juniper");
const rare_candy_1 = require("../set-scarlet-and-violet/rare-candy");
class DarkPatchDEX extends dark_patch_1.DarkPatch {
    constructor() {
        super(...arguments);
        this.setNumber = '93';
        this.fullName = 'Dark Patch DEX';
        this.set = 'DEX';
    }
}
exports.DarkPatchDEX = DarkPatchDEX;
class DarkraiExDEX extends darkrai_ex_1.DarkraiEx {
    constructor() {
        super(...arguments);
        this.setNumber = '107';
        this.fullName = 'Darkrai EX DEX 107';
        this.set = 'DEX';
    }
}
exports.DarkraiExDEX = DarkraiExDEX;
class EnhancedHammerDEX extends enhanced_hammer_1.EnhancedHammer {
    constructor() {
        super(...arguments);
        this.setNumber = '94';
        this.fullName = 'Enhanced Hammer DEX';
        this.set = 'DEX';
    }
}
exports.EnhancedHammerDEX = EnhancedHammerDEX;
class ProfessorJuniperDEX extends professor_juniper_1.ProfessorJuniper {
    constructor() {
        super(...arguments);
        this.setNumber = '98';
        this.fullName = 'Professor Juniper DEX';
        this.set = 'DEX';
    }
}
exports.ProfessorJuniperDEX = ProfessorJuniperDEX;
class RareCandyDEX extends rare_candy_1.RareCandy {
    constructor() {
        super(...arguments);
        this.setNumber = '100';
        this.fullName = 'Rare Candy DEX';
        this.set = 'DEX';
        this.text = 'Choose 1 of your Basic Pokémon in play. If you have a Stage 2 card in your hand that evolves from that Pokémon, put that card on the Basic Pokémon. (This counts as evolving that Pokémon.) You can\'t use this card during your first turn or on a Basic Pokémon that was put into play this turn.';
        this.regulationMark = '';
    }
}
exports.RareCandyDEX = RareCandyDEX;
class CherenDEX extends cheren_1.Cheren {
    constructor() {
        super(...arguments);
        this.setNumber = '91';
        this.fullName = 'Cheren DEX';
        this.set = 'DEX';
    }
}
exports.CherenDEX = CherenDEX;
class NDEX extends n_1.N {
    constructor() {
        super(...arguments);
        this.setNumber = '96';
        this.fullName = 'N DEX';
        this.set = 'DEX';
    }
}
exports.NDEX = NDEX;
class UltraBallDEX extends ultra_ball_1.UltraBall {
    constructor() {
        super(...arguments);
        this.setNumber = '102';
        this.fullName = 'Ultra Ball DEX';
        this.set = 'DEX';
    }
}
exports.UltraBallDEX = UltraBallDEX;
class RaikouEx2DEX extends raikou_ex_1.RaikouEx {
    constructor() {
        super(...arguments);
        this.setNumber = '105';
        this.fullName = 'Raikou EX2 DEX';
        this.set = 'DEX';
    }
}
exports.RaikouEx2DEX = RaikouEx2DEX;
class TornadusEx2DEX extends tornadus_ex_1.TornadusEx {
    constructor() {
        super(...arguments);
        this.setNumber = '108';
        this.fullName = 'Tornadus EX2 DEX';
        this.set = 'DEX';
    }
}
exports.TornadusEx2DEX = TornadusEx2DEX;
class ArcheopsDEX extends archeops_1.Archeops {
    constructor() {
        super(...arguments);
        this.setNumber = '110';
        this.fullName = 'Archeops DEX';
        this.set = 'DEX';
    }
}
exports.ArcheopsDEX = ArcheopsDEX;
class PokemonCatcherDEX extends pokemon_catcher_1.PokemonCatcher {
    constructor() {
        super(...arguments);
        this.setNumber = '111';
        this.fullName = 'Pokemon Catcher DEX';
        this.set = 'DEX';
    }
}
exports.PokemonCatcherDEX = PokemonCatcherDEX;
