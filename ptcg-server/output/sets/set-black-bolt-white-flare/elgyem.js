"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elgyem = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Elgyem extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Slight Shift',
                cost: [P],
                damage: 0,
                text: 'Move an Energy from 1 of your opponent\'s Pokémon to another of their Pokémon.'
            },
            {
                name: 'Beam',
                cost: [C, C, C],
                damage: 40,
                text: ''
            }
        ];
        this.regulationMark = 'I';
        this.set = 'BLK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Elgyem';
        this.fullName = 'Elgyem BLK';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Slight Shift
        // Ref: set-unbroken-bonds/tentacruel.ts (Wicked Tentacles)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let hasEnergy = false;
            let pokemonCount = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                pokemonCount += 1;
                hasEnergy = hasEnergy || cardList.cards.some(c => c instanceof game_1.EnergyCard);
            });
            if (!hasEnergy || pokemonCount <= 1) {
                return state;
            }
            store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), result => {
                const transfers = result || [];
                transfers.forEach(transfer => {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                });
            });
        }
        return state;
    }
}
exports.Elgyem = Elgyem;
