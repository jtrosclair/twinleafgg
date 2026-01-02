"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeasManaphy5 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class SeasManaphy5 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Natural Cure',
                useWhenInPlay: false,
                powerType: game_1.PowerType.POKEBODY,
                text: 'Whenever you attach a Water Energy card from your hand to Sea\'s Manaphy, remove all Special Conditions from Sea\'s Manaphy.'
            }];
        this.attacks = [{
                name: 'Water Pulse',
                cost: [W, C],
                damage: 20,
                text: 'The Defending Pokémon is now Asleep.'
            }];
        this.set = 'PCGP';
        this.name = 'Sea\'s Manaphy';
        this.fullName = 'Sea\'s Manaphy PCGP 154';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '154';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            if (effect.target.specialConditions.length === 0) {
                return state;
            }
            if (!effect.energyCard.provides.includes(card_types_1.CardType.WATER)) {
                return state;
            }
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                return state;
            }
            const conditions = effect.target.specialConditions.slice();
            conditions.forEach(condition => {
                effect.target.removeSpecialCondition(condition);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
        }
        return state;
    }
}
exports.SeasManaphy5 = SeasManaphy5;
