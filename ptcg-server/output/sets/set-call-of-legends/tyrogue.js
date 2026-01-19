"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tyrogue = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tyrogue extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 30;
        this.retreat = [];
        this.powers = [{
                name: 'Sweet Sleeping Face',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Tyrogue is Asleep, prevent all damage done to Tyrogue by attacks.'
            }];
        this.attacks = [{
                name: 'Mischievous Punch',
                cost: [],
                damage: 30,
                text: 'This attack\'s damage isn\'t affected by Weakness or Resistance. Tyrogue is now Asleep.'
            }];
        this.set = 'CL';
        this.name = 'Tyrogue';
        this.fullName = 'Tyrogue CL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (effect.target.cards.includes(this)
                && effect.target.getPokemonCard() === this
                && player.active.cards[0] === this
                && player.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP)
                && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                effect.damage = 0;
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            effect.ignoreResistance = true;
            effect.ignoreWeakness = true;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                }
            });
        }
        return state;
    }
}
exports.Tyrogue = Tyrogue;
