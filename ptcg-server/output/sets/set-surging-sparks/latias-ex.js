"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Latiasex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Latiasex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 210;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Skyliner',
                powerType: game_1.PowerType.ABILITY,
                text: 'Your Basic Pokémon in play have no Retreat Cost.'
            }];
        this.attacks = [{
                name: 'Eon Blade',
                cost: [P, P, C],
                damage: 200,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '76';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Latias ex';
        this.fullName = 'Latias ex SSP';
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
            let isLatiasexInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isLatiasexInPlay = true;
                }
            });
            if (!isLatiasexInPlay) {
                return state;
            }
            if (!(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this) && active.stage === card_types_1.Stage.BASIC) {
                effect.cost = [];
            }
            return state;
        }
        // Infinity Blade
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Legacy implementation:
            // - Set player.active.cannotAttackNextTurnPending = true directly.
            //
            // Converted to prefab version (THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN).
            (0, prefabs_1.THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN)(player);
        }
        return state;
    }
}
exports.Latiasex = Latiasex;
