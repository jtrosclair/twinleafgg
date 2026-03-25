"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Furret = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* usePower(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.hand, {}, { min: 2, max: 2, allowCancel: false }), selected => {
        cards = selected || [];
        if (cards.length === 0) {
            return;
        }
        // Put cards from hand into the deck
        player.hand.moveCardsTo(cards, player.deck);
        next();
    });
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (card.superType !== card_types_1.SuperType.ENERGY) {
            blocked.push(index);
        }
    });
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Furret extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sentret';
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Scavenger Hunt',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may put 2 cards from your hand into your deck. Then, search your deck for an Energy card, show it to your opponent, and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Furret is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Spinning Attack',
                cost: [C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'AQ';
        this.setNumber = '48';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Furret';
        this.fullName = 'Furret AQ';
        this.SCAVENGER_HUNT_MARKER = 'SCAVENGER_HUNT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            (0, prefabs_1.REMOVE_MARKER)(this.SCAVENGER_HUNT_MARKER, player, this);
            return state;
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SCAVENGER_HUNT_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.SCAVENGER_HUNT_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            if (player.hand.cards.length < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.ADD_MARKER)(this.SCAVENGER_HUNT_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            const generator = usePower(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Furret = Furret;
