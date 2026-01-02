"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallEnergy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const energy_card_1 = require("../../game/store/card/energy-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CallEnergy extends energy_card_1.EnergyCard {
    constructor() {
        super(...arguments);
        this.provides = [card_types_1.CardType.COLORLESS];
        this.energyType = card_types_1.EnergyType.SPECIAL;
        this.set = 'MD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '92';
        this.name = 'Call Energy';
        this.fullName = 'Call Energy MD';
        this.powers = [{
                name: 'Call Energy',
                text: 'Call Energy provides [C] Energy. Once during your turn, if the Pokémon Call Energy is attached to is your Active Pokémon, you may search your deck for up to 2 Basic Pokémon and put them onto your Bench. If you do, shuffle your deck and your turn ends.',
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                powerType: game_1.PowerType.ENERGY_ABILITY
            }];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect && effect.target.cards.includes(this) &&
            !effect.powers.find(p => p.name === this.powers[0].name)) {
            effect.powers.push(this.powers[0]);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Has to be active
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.cards.includes(this)) {
                    if (cardList !== player.active) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                    }
                }
            });
            prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, { stage: card_types_1.Stage.BASIC }, { min: 0, max: 2 });
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
            return store.reduceEffect(state, endTurnEffect);
        }
        return state;
    }
}
exports.CallEnergy = CallEnergy;
