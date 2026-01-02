"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArceusFighting = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ArceusFighting extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: W }];
        this.resistance = [{ type: L, value: -20 }];
        this.retreat = [C, C];
        this.tags = [card_types_1.CardTag.ARCEUS];
        this.powers = [{
                name: 'Arceus Rule',
                powerType: game_1.PowerType.ARCEUS_RULE,
                text: 'You may have as many of this card in your deck as you like.'
            }];
        this.attacks = [
            {
                name: 'Break Ground',
                cost: [F, C, C],
                damage: 60,
                text: 'Does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'AR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'AR8';
        this.name = 'Arceus';
        this.fullName = 'Arceus Fighting AR';
    }
    reduceEffect(store, state, effect) {
        // Break Ground
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                if (card !== player.active) {
                    const damage = new attack_effects_1.DealDamageEffect(effect, 10);
                    damage.target = card;
                    store.reduceEffect(state, damage);
                }
            });
        }
        return state;
    }
}
exports.ArceusFighting = ArceusFighting;
