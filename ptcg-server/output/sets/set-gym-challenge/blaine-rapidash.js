"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlainesRapidash = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class BlainesRapidash extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Blaine\'s Ponyta';
        this.tags = [card_types_1.CardTag.BLAINES];
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [];
        this.attacks = [{
                name: 'Fire Mane',
                cost: [R],
                damage: 20,
                text: ''
            },
            {
                name: 'Stamp',
                cost: [R, C, C],
                damage: 30,
                text: 'Flip a coin. If heads, this attack does 30 damage plus 10 more damage (to the Defending Pokémon) and 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) If tails, this attack does 30 damage (to the Defending Pokémon).'
            }];
        this.set = 'G2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Blaine\'s Rapidash';
        this.fullName = 'Blaine\'s Rapidash G2';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    // If heads, do 30 damage plus 10 more damage to the Defending Pokémon
                    (0, prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE)(effect, store, state, 10);
                    // Deal 10 damage to each of the opponent's Benched Pokémon
                    const opponent = effect.opponent;
                    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                        if (cardList !== opponent.active) {
                            const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                            damageEffect.target = cardList;
                            store.reduceEffect(state, damageEffect);
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.BlainesRapidash = BlainesRapidash;
