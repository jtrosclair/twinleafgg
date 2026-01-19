"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clamperl = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Clamperl extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 40;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Exoskeleton',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Any damage done to Clamperl by attacks is reduced by 10 (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Bubble',
                cost: [W, C],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Clamperl';
        this.fullName = 'Clamperl HL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.getPokemonCard() === this && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
            if (state.phase === game_1.GamePhase.ATTACK) {
                effect.damage -= 10;
            }
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Clamperl = Clamperl;
