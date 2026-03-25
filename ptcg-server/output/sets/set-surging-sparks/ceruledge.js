"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ceruledge = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ceruledge extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charcadet';
        this.hp = 140;
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Blaze Curse',
                cost: [C],
                damage: 0,
                text: 'Discard all Special Energy from each of your opponent\'s Pokémon.'
            },
            {
                name: 'Amethyst Rage',
                cost: [R, R, C],
                damage: 160,
                text: 'During your next turn, this Pokémon can\'t attack..'
            }];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.name = 'Ceruledge';
        this.fullName = 'Ceruledge SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Function to discard special energy and tools from a PokemonCardList
            const discardSpecialEnergy = (pokemonCardList) => {
                const cardsToDiscard = pokemonCardList.cards.filter(card => (card.superType === card_types_1.SuperType.ENERGY && card.energyType === card_types_1.EnergyType.SPECIAL));
                if (cardsToDiscard.length > 0) {
                    state = (0, prefabs_1.MOVE_CARDS)(store, state, pokemonCardList, opponent.discard, { cards: cardsToDiscard });
                }
            };
            // Discard from active Pokémon
            discardSpecialEnergy(opponent.active);
            // Discard from bench Pokémon
            opponent.bench.forEach(benchPokemon => {
                discardSpecialEnergy(benchPokemon);
            });
        }
        // Amethyst Rage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        return state;
    }
}
exports.Ceruledge = Ceruledge;
