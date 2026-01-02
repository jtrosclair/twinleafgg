"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SamiyasBuizel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class SamiyasBuizel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Aqua Lift',
                powerType: game_1.PowerType.POKEBODY,
                text: 'If Samiya\'s Buizel has any Water Energy attached to it, the Retreat Cost for Samiya\'s Buizel is 0.'
            }];
        this.attacks = [{
                name: 'Whirlpool',
                cost: [W, C],
                damage: 20,
                text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
            }];
        this.set = 'PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '138';
        this.name = 'Samiya\'s Buizel';
        this.fullName = 'Samiya\'s Buizel PCGP 138';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            // Check if there is any Water energy attached
            const hasPsychicEnergy = checkProvidedEnergy.energyMap.some(energy => energy.provides.includes(card_types_1.CardType.WATER) || energy.provides.includes(card_types_1.CardType.ANY));
            if (hasPsychicEnergy) {
                effect.cost = [];
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
                if (result) {
                    const player = effect.player;
                    const opponent = effect.opponent;
                    // If defending Pokemon has no energy cards attached, return early
                    if (!opponent.active.energies.cards.some(c => c instanceof game_1.EnergyCard)) {
                        return state;
                    }
                    let card;
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        card = selected[0];
                        return store.reduceEffect(state, new attack_effects_1.DiscardCardsEffect(effect, [card]));
                    });
                }
            });
        }
        return state;
    }
}
exports.SamiyasBuizel = SamiyasBuizel;
