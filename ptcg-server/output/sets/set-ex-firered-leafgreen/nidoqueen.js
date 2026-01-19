"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nidoqueen = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Nidoqueen extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Nidorina';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Family Bonds',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Nidoqueen is in play, the Retreat Cost for Nidoran Female, Nidorina, Nidoran Male, Nidorino and Nidoking is 0.'
            }];
        this.attacks = [
            {
                name: 'Toxic',
                cost: [G],
                damage: 0,
                text: 'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on the Defending Pokémon between turns.'
            },
            {
                name: 'Power Lariat',
                cost: [F, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Does 40 damage plus 10 more damage for each Evolved Pokémon you have in play.'
            }
        ];
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.name = 'Nidoqueen';
        this.fullName = 'Nidoqueen RG';
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
            let isNidoqueenInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isNidoqueenInPlay = true;
                }
            });
            if (!isNidoqueenInPlay) {
                return state;
            }
            if (!(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)
                && (active.name === 'Nidoran F'
                    || active.name === 'Nidorina'
                    || active.name === 'Nidoran M'
                    || active.name === 'Nidorino'
                    || active.name === 'Nidoking')) {
                effect.cost = [];
            }
            return state;
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this, 20);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let evolvedCount = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (list.getPokemons().length > 1 && card.stage !== card_types_1.Stage.LEGEND && card.stage !== card_types_1.Stage.VUNION && card.stage !== card_types_1.Stage.LV_X) {
                    evolvedCount++;
                }
            });
            effect.damage += 10 * evolvedCount;
        }
        return state;
    }
}
exports.Nidoqueen = Nidoqueen;
