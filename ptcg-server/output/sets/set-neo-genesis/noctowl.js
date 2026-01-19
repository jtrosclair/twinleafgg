"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Noctowl = void 0;
const game_1 = require("../../game");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Noctowl extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hoothoot';
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Glaring Gaze',
                powerType: game_2.PowerType.POKEMON_POWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, look at your opponent\'s hand. If your opponent has any Trainer cards there, choose 1 of them. Your opponent shuffles that card into his or her deck. This power can\'t be used if Noctowl is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Wing Attack',
                cost: [C, C, C],
                damage: 30,
                text: ''
            },];
        this.set = 'N1';
        this.setNumber = '42';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Noctowl';
        this.fullName = 'Noctowl N1';
        this.GAZE_MARKER = 'GAZE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.GAZE_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_ASLEEP_CONFUSED_PARALYZED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.GAZE_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    let cards = [];
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_SHUFFLE, opponent.hand, { superType: game_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                        (0, prefabs_1.MOVE_CARDS)(store, state, opponent.hand, opponent.deck, { cards });
                        (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
                    });
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.GAZE_MARKER, this);
        return state;
    }
}
exports.Noctowl = Noctowl;
