"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Glalie = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Glalie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Snorunt';
        this.cardType = W;
        this.hp = 80;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.powers = [{
                name: 'Ice Wall',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Any damage done to Glalie by attacks from your opponent\'s Pokémon with any Special Energy cards attached to it is reduced by 40 (after applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Heavy Blizzard',
                cost: [W],
                damage: 50,
                text: 'Flip a coin. If heads, put 1 damage counter on each of your opponent\'s Benched Pokémon.'
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Glalie';
        this.fullName = 'Glalie HL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.getPokemonCard() === this && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, effect.player, this)) {
            if (effect.source.cards.some(card => card.energyType === card_types_1.EnergyType.SPECIAL)) {
                effect.damage -= 40;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    const player = effect.player;
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                        if (cardList !== opponent.active) {
                            const countersEffect = new attack_effects_1.PutCountersEffect(effect, 10);
                            countersEffect.target = cardList;
                            store.reduceEffect(state, countersEffect);
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Glalie = Glalie;
