"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lileep = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Lileep extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.RESTORED;
        this.evolvesFrom = 'Root Fossil Lileep';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Prehistoric Call',
                useFromDiscard: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pok\u00e9mon is in your discard pile, you may put this Pok\u00e9mon on the bottom of your deck.'
            }];
        this.attacks = [
            {
                name: 'Spiral Drain',
                cost: [G, C],
                damage: 20,
                text: 'Heal 10 damage from this Pok\u00e9mon.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '3';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lileep';
        this.fullName = 'Lileep PLB';
        this.PREHISTORIC_CALL_MARKER = 'PREHISTORIC_CALL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (!player.discard.cards.includes(this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.PREHISTORIC_CALL_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            // Move to bottom of deck
            player.discard.moveCardTo(this, player.deck);
            // Move to bottom: remove from current position and push to end
            const index = player.deck.cards.indexOf(this);
            if (index !== -1) {
                player.deck.cards.splice(index, 1);
                player.deck.cards.push(this);
            }
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.PREHISTORIC_CALL_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(10, effect, store, state);
        }
        return state;
    }
}
exports.Lileep = Lileep;
