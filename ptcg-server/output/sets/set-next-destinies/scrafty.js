"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scrafty = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Scrafty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scraggy';
        this.cardType = D;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Rock Head',
                cost: [D],
                damage: 20,
                text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
            },
            {
                name: 'Hammer Kick',
                cost: [D, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If this Pokémon has fewer remaining HP than the Defending Pokémon, this attack does 30 more damage.'
            }
        ];
        this.set = 'NXD';
        this.setNumber = '74';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Scrafty';
        this.fullName = 'Scrafty NXD';
        this.ROCK_HEAD_MARKER = 'ROCK_HEAD_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Rock Head - add marker for damage reduction
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.getPokemonCard() === this) {
                    (0, prefabs_1.ADD_MARKER)(this.ROCK_HEAD_MARKER, cardList, this);
                }
            });
        }
        // Reduce damage if marker is present
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this)) {
            if ((0, prefabs_1.HAS_MARKER)(this.ROCK_HEAD_MARKER, effect.target, this)) {
                effect.damage = Math.max(0, effect.damage - 20);
            }
        }
        // Hammer Kick - bonus damage if less HP
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const myRemainingHP = this.hp - player.active.damage;
            const defenderCard = opponent.active.getPokemonCard();
            const defenderRemainingHP = defenderCard ? defenderCard.hp - opponent.active.damage : 0;
            if (myRemainingHP < defenderRemainingHP) {
                effect.damage += 30;
            }
        }
        // Remove marker at end of opponent's turn
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.getPokemonCard() === this) {
                    (0, prefabs_1.REMOVE_MARKER)(this.ROCK_HEAD_MARKER, cardList, this);
                }
            });
        }
        return state;
    }
}
exports.Scrafty = Scrafty;
