"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fearow = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Fearow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Spearow';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Delta Sign',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may search your deck for a Pokémon that has Delta on its card, show it to your opponent, and put it into your hand. Shuffle your deck afterward. You can\'t use more than 1 Delta Sign Poké- Power each turn.This power can\'t be used if Fearow is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Pierce',
                cost: [L, C],
                damage: 30,
                text: ''
            }];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Fearow';
        this.fullName = 'Fearow CG';
        this.DELTA_SIGN_MARKER = 'DELTA_SIGN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.HAS_MARKER)(this.DELTA_SIGN_MARKER, player)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.ADD_MARKER)(this.DELTA_SIGN_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                if (c instanceof pokemon_card_1.PokemonCard && c.tags.includes(card_types_1.CardTag.DELTA_SPECIES)) {
                    return;
                }
                else {
                    blocked.push(index);
                }
            });
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
                cards = selected || [];
                (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, cards);
                (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards: cards, sourceCard: this, sourceEffect: this.powers[0] });
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.DELTA_SIGN_MARKER, this);
        return state;
    }
}
exports.Fearow = Fearow;
