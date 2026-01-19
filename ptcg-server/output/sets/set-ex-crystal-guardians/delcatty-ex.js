"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delcattyex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Delcattyex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Skitty';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = C;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.powers = [{
                name: 'Constrain',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may use this power. Each player discards cards until that player has 6 cards in his or her hand. (You discard first.) This power can\'t be used if Delcatty ex is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Upstream',
                cost: [C],
                damage: 10,
                damageCalculation: 'x',
                text: 'Search your discard pile for all Energy cards. This attack does 10 damage times the number of Energy cards you find there. Show them to your opponent, and put them on top of your deck. Shuffle your deck afterward.'
            },
            {
                name: 'Tail Slap',
                cost: [C, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Delcatty ex';
        this.fullName = 'Delcatty ex CG';
        this.NIGHT_VISION_MARKER = 'NIGHT_VISION_MARKER';
    }
    reduceEffect(store, state, effect) {
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.NIGHT_VISION_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.HAS_MARKER)(this.NIGHT_VISION_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            // Get player's hand length
            const playerHandLength = player.hand.cards.length;
            // Set discard amount to reach hand size of 6
            const playerDiscardAmount = playerHandLength - 6;
            // Player discards
            if (player.hand.cards.length > 6) {
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { min: playerDiscardAmount, max: playerDiscardAmount, allowCancel: false }), selected => {
                    const cards = selected || [];
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, player.discard, { cards: cards, sourceCard: this, sourceEffect: this.powers[0] });
                });
            }
            // Get opponent's hand length
            const opponentHandLength = opponent.hand.cards.length;
            // Set discard amount to reach hand size of 6
            const discardAmount = opponentHandLength - 6;
            // Opponent discards second
            if (opponent.hand.cards.length > 6) {
                store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: discardAmount, max: discardAmount, allowCancel: false }), selected => {
                    const cards = selected || [];
                    (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.discard, { cards: cards, sourceCard: this, sourceEffect: this.powers[0] });
                });
            }
            (0, prefabs_1.ADD_MARKER)(this.NIGHT_VISION_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const energyInDiscard = player.discard.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
            effect.damage = energyInDiscard.length * 10;
            (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.deck, { cards: energyInDiscard, sourceCard: this, sourceEffect: this.attacks[0] });
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
        }
        return state;
    }
}
exports.Delcattyex = Delcattyex;
