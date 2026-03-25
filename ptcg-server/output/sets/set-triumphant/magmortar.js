"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magmortar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Magmortar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Magmar';
        this.cardType = R;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Top Burner',
                cost: [R],
                damage: 0,
                text: 'For each [R] Energy attached to Magmortar, discard the top card from your opponent\'s deck. Then, flip a coin. If tails, discard all [R] Energy attached to Magmortar.'
            },
            {
                name: 'Burst Punch',
                cost: [R, R, C],
                damage: 60,
                text: 'The Defending Pokémon is now Burned.'
            }];
        this.set = 'TM';
        this.setNumber = '27';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Magmortar';
        this.fullName = 'Magmortar TM';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const totalPsychicEnergy = checkProvidedEnergy.energyMap.reduce((sum, energy) => {
                return sum + energy.provides.filter(type => type === card_types_1.CardType.FIRE || type === card_types_1.CardType.ANY).length;
            }, 0);
            (0, prefabs_1.MOVE_CARDS)(store, state, opponent.deck, opponent.discard, { count: totalPsychicEnergy, sourceCard: this, sourceEffect: this.attacks[0] });
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    (0, prefabs_1.DISCARD_ALL_ENERGY_FROM_POKEMON)(store, state, effect, this);
                }
            });
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Magmortar = Magmortar;
