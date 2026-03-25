"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salamence = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
class Salamence extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Shelgon';
        this.cardType = N;
        this.hp = 140;
        this.weakness = [{ type: N }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Scornful Storm',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may have your opponent discard cards from his or her hand until he or she has 4 cards left in his or her hand.'
            }];
        this.attacks = [
            {
                name: 'Shred',
                cost: [R, W, C, C],
                damage: 90,
                text: 'This attack\'s damage isn\'t affected by any effects on the Defending Pok\u00e9mon.'
            }
        ];
        this.set = 'DRV';
        this.setNumber = '8';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Salamence';
        this.fullName = 'Salamence DRV';
        this.SCORNFUL_STORM_MARKER = 'SCORNFUL_STORM_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Ability: Scornful Storm
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const handSize = opponent.hand.cards.length;
            if (handSize <= 4) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.SCORNFUL_STORM_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            const cardsToRemove = handSize - 4;
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: cardsToRemove, max: cardsToRemove, allowCancel: false }), selected => {
                selected = selected || [];
                (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.discard, { cards: selected });
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, selected);
            });
        }
        (0, prefabs_2.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SCORNFUL_STORM_MARKER, this);
        // Attack: Shred
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS)(store, state, effect, 90);
        }
        return state;
    }
}
exports.Salamence = Salamence;
