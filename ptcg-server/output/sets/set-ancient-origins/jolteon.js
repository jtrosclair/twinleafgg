"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jolteon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Jolteon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [];
        this.powers = [
            {
                name: 'Electric Effect',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each of your Stage 1 Pokémon in play is now a [L] Pokémon in addition to its existing types.'
            }
        ];
        this.attacks = [
            {
                name: 'Thunder Blast',
                cost: [L, C, C],
                damage: 80,
                text: 'Discard an Energy attached to this Pokémon.'
            }
        ];
        this.set = 'AOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Jolteon';
        this.fullName = 'Jolteon AOR';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && ((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_1 && !prefabs_1.IS_ABILITY_BLOCKED(store, state, game_1.StateUtils.findOwner(state, effect.target), this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            let isJolteonInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isJolteonInPlay = true;
                }
            });
            if (!isJolteonInPlay) {
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList === effect.target) {
                    if (!effect.cardTypes.includes(card_types_1.CardType.LIGHTNING)) {
                        effect.cardTypes = [...effect.cardTypes, card_types_1.CardType.LIGHTNING];
                    }
                }
            });
        }
        // Thunder Blast
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
        }
        return state;
    }
}
exports.Jolteon = Jolteon;
