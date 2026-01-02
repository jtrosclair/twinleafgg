"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MimeJr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MimeJr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 30;
        this.retreat = [];
        this.powers = [{
                name: 'Sweet Sleeping Face',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Mime Jr. is Asleep, prevent all damage done to Mime Jr. by attacks.'
            }];
        this.attacks = [{
                name: 'Sleepy Lost',
                cost: [],
                damage: 0,
                text: 'Put the top card of your opponent\'s deck in the Lost Zone. Mime Jr. is now Asleep.'
            }];
        this.set = 'CL';
        this.name = 'Mime Jr.';
        this.fullName = 'Mime Jr. CL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '47';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (effect.target.cards.includes(this)
                && effect.target.getPokemonCard() === this
                && player.active.cards[0] === this
                && player.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP)
                && !prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                effect.damage = 0;
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.MOVE_CARDS(store, state, opponent.deck, opponent.lostzone, { cards: [opponent.deck.cards[0]], sourceCard: this, sourceEffect: this.attacks[0] });
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                }
            });
        }
        return state;
    }
}
exports.MimeJr = MimeJr;
