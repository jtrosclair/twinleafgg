"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garchomp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Garchomp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gabite';
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: C, value: +30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Rainbow Scale',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If an Active Pokémon has Weakness to any of the types of Energy attached to Garchomp, Garchomp\'s attacks do 40 more damage to that Pokémon (before applying Weakness and Resistance). Rainbow Scale Poké-Body can\'t be used if Garchomp has any Special Energy cards attached to it.'
            }];
        this.attacks = [{
                name: 'Dragon Fang',
                cost: [C, C, C],
                damage: 70,
                text: ''
            }];
        this.set = 'MT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Garchomp';
        this.fullName = 'Garchomp MT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.source.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = effect.opponent;
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                return state;
            }
            if (effect.source.energies.cards.some(card => card.superType === card_types_1.SuperType.ENERGY && card.energyType === card_types_1.EnergyType.SPECIAL)) {
                return state;
            }
            const energyTypes = [];
            effect.source.cards.forEach(card => {
                if (card instanceof game_1.EnergyCard) {
                    energyTypes.push(card.provides[0]);
                }
            });
            if (energyTypes.some(type => { var _a; return (_a = opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.weakness.some(weakness => weakness.type === type); })) {
                effect.damage += 40;
            }
        }
        return state;
    }
}
exports.Garchomp = Garchomp;
