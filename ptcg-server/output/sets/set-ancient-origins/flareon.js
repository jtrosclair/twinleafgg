"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flareon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Flareon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [
            {
                name: 'Flare Effect',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each of your Stage 1 Pokémon in play is now a [R] Pokémon in addition to its existing types.'
            }
        ];
        this.attacks = [
            {
                name: 'Heat Breath',
                cost: [R, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }
        ];
        this.set = 'AOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Flareon';
        this.fullName = 'Flareon AOR';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && ((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.STAGE_1 && !prefabs_1.IS_ABILITY_BLOCKED(store, state, game_1.StateUtils.findOwner(state, effect.target), this)) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
            let isFlareonInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isFlareonInPlay = true;
                }
            });
            if (!isFlareonInPlay) {
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList === effect.target) {
                    if (!effect.cardTypes.includes(card_types_1.CardType.FIRE)) {
                        effect.cardTypes = [...effect.cardTypes, card_types_1.CardType.FIRE];
                    }
                }
            });
        }
        // Heat Breath
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
        }
        return state;
    }
}
exports.Flareon = Flareon;
