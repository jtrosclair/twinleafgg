"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Psyduck = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Psyduck extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 70;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Damp',
                powerType: game_1.PowerType.ABILITY,
                text: 'Pokémon in play (both yours and your opponent\'s) lose any Ability that requires the Pokémon using it to Knock Out itself.'
            }];
        this.attacks = [{
                name: 'Ram',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'MEP';
        this.setNumber = '7';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Psyduck';
        this.fullName = 'Psyduck MEP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === game_1.PowerType.ABILITY && effect.power.name !== 'Damp') {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let isPsyduckInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isPsyduckInPlay = true;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isPsyduckInPlay = true;
                }
            });
            if (!isPsyduckInPlay) {
                return state;
            }
            if (!effect.power.knocksOutSelf) {
                return state;
            }
            // Try reducing ability for each player  
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        return state;
    }
}
exports.Psyduck = Psyduck;
