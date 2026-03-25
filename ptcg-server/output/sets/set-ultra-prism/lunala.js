"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lunala = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lunala extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.PRISM_STAR];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 160;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Full Moon Star',
                cost: [P],
                damage: 0,
                text: 'For each of your opponent\'s Pokémon in play, attach a [P] Energy card from your discard pile to your Pokémon in any way you like.'
            },
            {
                name: 'Psystorm',
                cost: [P, P, P, P],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage times the amount of Energy attached to all Pokémon.'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '62';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lunala \u25c7';
        this.fullName = 'Lunala \u25c7 UPR';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Full Moon Star
        // Ref: set-noble-victories/eelektrik.ts (Dynamotor - attach energy from discard)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Count opponent's Pokemon in play
            let opponentPokemonCount = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, () => {
                opponentPokemonCount++;
            });
            // Count available [P] Energy in discard
            const psychicEnergyCount = player.discard.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(card_types_1.CardType.PSYCHIC)).length;
            const maxAttach = Math.min(opponentPokemonCount, psychicEnergyCount);
            if (maxAttach === 0) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Psychic Energy' }, { min: 0, max: maxAttach, allowCancel: false }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        // Attack 2: Psystorm
        // Ref: set-guardians-rising/honchkrow.ts (Raven's Claw - counting across all Pokemon)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let totalEnergy = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                totalEnergy += cardList.cards.filter(c => c instanceof game_1.EnergyCard).length;
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                totalEnergy += cardList.cards.filter(c => c instanceof game_1.EnergyCard).length;
            });
            effect.damage = 20 * totalEnergy;
        }
        return state;
    }
}
exports.Lunala = Lunala;
