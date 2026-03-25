"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metagross = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const state_utils_1 = require("../../game/store/state-utils");
const card_types_1 = require("../../game/store/card/card-types");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class Metagross extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Metang';
        this.cardType = P;
        this.hp = 140;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Plasma Search',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may search your deck for a Team Plasma card, reveal it, and put it in your hand. Shuffle your deck afterward. You may not use an Ability with the same name during your turn.'
            }];
        this.attacks = [
            {
                name: 'Mind Bend',
                cost: [P, C, C, C],
                damage: 60,
                text: 'The Defending Pokémon is now Confused.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '52';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Metagross';
        this.fullName = 'Metagross PLF';
        this.PLASMA_SEARCH_MARKER = 'PLASMA_SEARCH_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Ability: Plasma Search
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            (0, prefabs_1.BLOCK_IF_DECK_EMPTY)(player);
            (0, prefabs_1.USE_ABILITY_ONCE_PER_TURN)(player, this.PLASMA_SEARCH_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            // Build blocked list: only Team Plasma cards
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                if (!c.tags || !c.tags.includes(card_types_1.CardTag.TEAM_PLASMA)) {
                    blocked.push(index);
                }
            });
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 1, allowCancel: true, blocked }), selected => {
                if (selected && selected.length > 0) {
                    // Reveal to opponent
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, selected);
                    player.deck.moveCardTo(selected[0], player.hand);
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.PLASMA_SEARCH_MARKER, this);
        // Attack: Mind Bend
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Metagross = Metagross;
