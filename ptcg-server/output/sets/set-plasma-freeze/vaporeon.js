"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaporeon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vaporeon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Refreshing Rain',
                cost: [C],
                damage: 0,
                text: 'Heal 30 damage from each of your Pokémon.'
            },
            {
                name: 'Gold Breaker',
                cost: [W, C],
                damage: 30,
                damageCalculation: '+',
                text: 'If the Defending Pokémon is a Pokémon-EX, this attack does 50 more damage.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '20';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vaporeon';
        this.fullName = 'Vaporeon PLF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.damage > 0) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, 30);
                    store.reduceEffect(state, healEffect);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const defending = opponent.active.getPokemonCard();
            if (defending && defending.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                effect.damage += 50;
            }
        }
        return state;
    }
}
exports.Vaporeon = Vaporeon;
