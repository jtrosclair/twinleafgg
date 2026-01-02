"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragapultex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_2 = require("../../game/store/prefabs/attack-effects");
class Dragapultex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.evolvesFrom = 'Drakloak';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 320;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Jet Headbutt',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }, {
                name: 'Phantom Dive',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.PSYCHIC],
                damage: 200,
                text: 'Put 6 damage counters on your opponent\'s Benched Pokemon in any way you like.'
            }];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.name = 'Dragapult ex';
        this.fullName = 'Dragapult ex TWM';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            attack_effects_2.PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(6, store, state, effect, [play_card_action_1.SlotType.BENCH]);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Dragapultex = Dragapultex;
