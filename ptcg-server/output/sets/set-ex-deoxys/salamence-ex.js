"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salamenceex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const costs_1 = require("../../game/store/prefabs/costs");
class Salamenceex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Shelgon';
        this.cardType = C;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.hp = 160;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: R, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Dragon Lift',
                powerType: game_1.PowerType.POKEBODY,
                text: 'The Retreat Cost for each of your Pokémon (excluding Pokémon-ex and Baby Pokémon) is 0.'
            }];
        this.attacks = [{
                name: 'Flame Jet',
                cost: [R, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon.This attack does 40 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness or Resistance.'
            },
            {
                name: 'Bright Flame',
                cost: [R, W, C, C],
                damage: 120,
                text: 'Discard 2 Energy attached to Salamence ex.'
            }];
        this.set = 'DX';
        this.setNumber = '103';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Salamence ex';
        this.fullName = 'Salamence ex DX';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            const active = effect.player.active.getPokemonCard();
            if (owner !== player || active === undefined) {
                return state;
            }
            let isSalamenceexInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isSalamenceexInPlay = true;
                }
            });
            if (!isSalamenceexInPlay) {
                return state;
            }
            if (!(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this) && !active.tags.includes(card_types_1.CardTag.POKEMON_ex) && !active.tags.includes(card_types_1.CardTag.BABY)) {
                effect.cost = [];
            }
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(40, effect, store, state);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON)(store, state, effect, 2);
        }
        return state;
    }
}
exports.Salamenceex = Salamenceex;
