"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voltorb = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Voltorb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 50;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Floating Electrons',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as Voltorb has any Energy attached to it, Voltorb\'s Retreat Cost is 0.'
            }];
        this.attacks = [{
                name: 'Thundershock',
                cost: [L, C],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            }];
        this.set = 'RG';
        this.name = 'Voltorb';
        this.fullName = 'Voltorb RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            if (checkProvidedEnergy.energyMap.length !== 0) {
                effect.cost = [];
            }
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (result) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Voltorb = Voltorb;
