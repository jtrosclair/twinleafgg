"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaporeon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vaporeon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'Aqua Effect',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each of your Stage 1 Pokémon in play is now a [W] Pokémon in addition to its existing types.'
            }
        ];
        this.attacks = [
            {
                name: 'Hydro Splash',
                cost: [W, C, C],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'AOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Vaporeon';
        this.fullName = 'Vaporeon AOR';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && ((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_1 && !(0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, game_1.StateUtils.findOwner(state, effect.target), this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            let isVaporeonInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isVaporeonInPlay = true;
                }
            });
            if (!isVaporeonInPlay) {
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList === effect.target) {
                    if (!effect.cardTypes.includes(card_types_1.CardType.WATER)) {
                        effect.cardTypes = [...effect.cardTypes, card_types_1.CardType.WATER];
                    }
                }
            });
        }
        return state;
    }
}
exports.Vaporeon = Vaporeon;
