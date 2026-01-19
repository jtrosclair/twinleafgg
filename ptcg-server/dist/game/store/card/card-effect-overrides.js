"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOverriddenReduceEffect = void 0;
const card_types_1 = require("./card-types");
const great_ball_1 = require("../../../sets/set-ex-firered-leafgreen/great-ball");
const great_ball_2 = require("../../../sets/set-paldea-evolved/great-ball");
const master_ball_1 = require("../../../sets/set-ex-deoxys/master-ball");
const master_ball_2 = require("../../../sets/set-temporal-forces/master-ball");
const pokemon_fan_club_1 = require("../../../sets/set-pop-series-4/pokemon-fan-club");
const pokemon_fan_club_2 = require("../../../sets/set-ultra-prism/pokemon-fan-club");
// import { QuickBall as QuickBallMD } from '../../../sets/set-majestic-dawn/quick-ball';
// import { QuickBall as QuickBallSSH } from '../../../sets/set-sword-and-shield/quick-ball';
const rare_candy_1 = require("../../../sets/set-ex-holon-phantoms/rare-candy");
const rare_candy_2 = require("../../../sets/set-scarlet-and-violet/rare-candy");
// import { SuperRod as SuperRodNVI } from '../../../sets/set-noble-victories/super-rod';
// import { SuperRod as SuperRodPAL } from '../../../sets/set-paldea-evolved/super-rod';
const pokemon_catcher_1 = require("../../../sets/set-emerging-powers/pokemon-catcher");
const pokemon_catcher_2 = require("../../../sets/set-scarlet-and-violet/pokemon-catcher");
const effectOverrides = {
    // 'Super Rod': {
    //   [Format.RETRO]: SuperRodNVI.prototype.reduceEffect,
    //   default: SuperRodPAL.prototype.reduceEffect
    // }
    'Great Ball': {
        [card_types_1.Format.RSPK]: great_ball_1.GreatBall.prototype.reduceEffect,
        default: great_ball_2.GreatBall.prototype.reduceEffect
    },
    'Master Ball': {
        [card_types_1.Format.RSPK]: master_ball_1.MasterBall.prototype.reduceEffect,
        default: master_ball_2.MasterBall.prototype.reduceEffect
    },
    'Pokémon Fan Club': {
        [card_types_1.Format.RSPK]: pokemon_fan_club_1.PokemonFanClub.prototype.reduceEffect,
        default: pokemon_fan_club_2.PokemonFanClub.prototype.reduceEffect
    },
    'Rare Candy': {
        [card_types_1.Format.RSPK]: rare_candy_1.RareCandy.prototype.reduceEffect,
        default: rare_candy_2.RareCandy.prototype.reduceEffect
    },
    // 'Quick Ball': {
    //   [Format.DP]: QuickBallMD.prototype.reduceEffect,
    //   default: QuickBallSSH.prototype.reduceEffect
    // },
    'Pokemon Catcher': {
        [card_types_1.Format.BW]: pokemon_catcher_1.PokemonCatcher.prototype.reduceEffect,
        default: pokemon_catcher_2.PokemonCatcher.prototype.reduceEffect
    },
};
function getOverriddenReduceEffect(card, format) {
    const key = `${card.name}`;
    const overrides = effectOverrides[key];
    if (overrides) {
        if (overrides[format]) {
            return overrides[format].bind(card);
        }
        if (overrides.default) {
            return overrides.default.bind(card);
        }
    }
    return undefined;
}
exports.getOverriddenReduceEffect = getOverriddenReduceEffect;
