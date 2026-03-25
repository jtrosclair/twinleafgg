"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tirtouga = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tirtouga extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.RESTORED;
        this.evolvesFrom = 'Cover Fossil';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Prehistoric Call',
                useFromDiscard: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is in your discard pile, you may put this Pokémon on the bottom of your deck.'
            }];
        this.attacks = [
            {
                name: 'Slam',
                cost: [W, C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '27';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tirtouga';
        this.fullName = 'Tirtouga PLB';
        this.PREHISTORIC_CALL_MARKER = 'PREHISTORIC_CALL_MARKER_TIRTOUGA';
    }
    reduceEffect(store, state, effect) {
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.PREHISTORIC_CALL_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            if (!player.discard.cards.includes(this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.PREHISTORIC_CALL_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            // Move to bottom of deck
            player.discard.moveCardTo(this, player.deck);
            const index = player.deck.cards.indexOf(this);
            if (index !== -1) {
                player.deck.cards.splice(index, 1);
                player.deck.cards.push(this);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 2, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 30 * heads;
            });
        }
        return state;
    }
}
exports.Tirtouga = Tirtouga;
