"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokeParksCelebi = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class PokeParksCelebi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Natural Cure',
                useWhenInPlay: false,
                powerType: game_1.PowerType.POKEBODY,
                text: 'When you attach a [G] Energy card from your hand to this Pokémon, remove all Special Conditions from this Pokémon.'
            }];
        this.attacks = [{
                name: 'Psyshock',
                cost: [G, C],
                damage: 20,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }];
        this.set = 'PCGP';
        this.name = 'PokéPark\'s Celebi';
        this.fullName = 'PokéPark\'s Celebi PCGP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            if (effect.target.specialConditions.length === 0) {
                return state;
            }
            if (!effect.energyCard.provides.includes(card_types_1.CardType.GRASS)) {
                return state;
            }
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const conditions = effect.target.specialConditions.slice();
            conditions.forEach(condition => {
                effect.target.removeSpecialCondition(condition);
            });
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
exports.PokeParksCelebi = PokeParksCelebi;
