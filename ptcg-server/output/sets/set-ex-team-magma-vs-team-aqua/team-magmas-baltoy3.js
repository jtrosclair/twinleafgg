"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMagmasBaltoy3 = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamMagmasBaltoy3 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_MAGMA];
        this.cardType = P;
        this.hp = 50;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Psymist',
                cost: [C],
                damage: 0,
                text: 'Flip 2 coins. For each heads, choose 1 of you opponent\'s Pokémon and put 1 damage counter on that Pokémon.'
            },
            {
                name: 'Pain Amplifier',
                cost: [P, C],
                damage: 0,
                text: 'Put 1 damage counter on each of your opponent\'s Pokémon that already has damage counters on it.'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Team Magma\'s Baltoy';
        this.fullName = 'Team Magma\'s Baltoy MA 32';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                (0, attack_effects_2.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE)(heads, store, state, effect);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList.damage === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, 10);
                damageEffect.target = cardList;
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.TeamMagmasBaltoy3 = TeamMagmasBaltoy3;
