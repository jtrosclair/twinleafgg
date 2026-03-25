"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rhydon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Rhydon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rhyhorn';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Power Diffusion',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as Rhydon is your Active Pokémon, prevent all damage done by attacks to all of your Benched Pokémon.'
            }];
        this.attacks = [{
                name: 'Horn Drill',
                cost: [C],
                damage: 20,
                text: ''
            },
            {
                name: 'Hyper Tail',
                cost: [F, C, C],
                damage: 50,
                damageCalculation: '+',
                text: 'If the Defending Pokémon has any Poké-Powers or Poké-Bodies, this attack does 50 damage plus 20 more damage.'
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Rhydon';
        this.fullName = 'Rhydon HL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            const targetPlayer = state_utils_1.StateUtils.findOwner(state, effect.target);
            let isRhydonActive = false;
            targetPlayer.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && cardList === targetPlayer.active) {
                    isRhydonActive = true;
                }
            });
            if (!isRhydonActive) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, targetPlayer, this)) {
                return state;
            }
            effect.preventDefault = true;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const opponentActivePokemon = opponent.active.getPokemonCard();
            if (opponentActivePokemon) {
                const powersEffect = new check_effects_1.CheckPokemonPowersEffect(opponent, opponentActivePokemon);
                state = store.reduceEffect(state, powersEffect);
                if (powersEffect.powers.some(power => power.powerType === pokemon_types_1.PowerType.POKEBODY || power.powerType === pokemon_types_1.PowerType.POKEPOWER)) {
                    (0, prefabs_1.THIS_ATTACK_DOES_X_MORE_DAMAGE)(effect, store, state, 20);
                }
            }
        }
        return state;
    }
}
exports.Rhydon = Rhydon;
