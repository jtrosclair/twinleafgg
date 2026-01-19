"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotasMimeJr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class RotasMimeJr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Teeter Dance',
                cost: [C],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused. If tails, both the Defending Pokémon and Rota\'s Mime Jr. are now Confused.'
            }];
        this.set = 'PCGP';
        this.name = 'Rota\'s Mime Jr.';
        this.fullName = 'Rota\'s Mime Jr. PCGP 86';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, (result) => {
                if (result) {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)(store, state, effect);
                }
                else {
                    (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED)(store, state, effect);
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.player, this);
                }
            });
        }
        return state;
    }
}
exports.RotasMimeJr = RotasMimeJr;
