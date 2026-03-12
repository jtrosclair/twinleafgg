"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spikemuth = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const state_utils_1 = require("../../game/store/state-utils");
class Spikemuth extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'DAA';
        this.setNumber = '170';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Spikemuth';
        this.fullName = 'Spikemuth DAA';
        this.text = 'Whenever a player\'s Active Pokémon moves to the Bench during their turn, put 2 damage counters on that Pokémon.';
        this.lastActiveIds = {};
    }
    reduceEffect(store, state, effect) {
        if (state_utils_1.StateUtils.getStadiumCard(state) !== this) {
            this.lastActiveIds = {};
            return state;
        }
        for (const player of state.players) {
            const activePokemon = player.active.getPokemonCard();
            if (!activePokemon)
                continue;
            const currentId = activePokemon.id;
            const lastId = this.lastActiveIds[player.id];
            if (lastId !== undefined && lastId !== currentId) {
                // Active Pokemon changed - find old active on bench and damage it
                for (const bench of player.bench) {
                    const benchPokemon = bench.getPokemonCard();
                    if (benchPokemon && benchPokemon.id === lastId) {
                        bench.damage += 20;
                        break;
                    }
                }
            }
            this.lastActiveIds[player.id] = currentId;
        }
        return state;
    }
}
exports.Spikemuth = Spikemuth;
