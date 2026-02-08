"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dedenne = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const energy_card_1 = require("../../game/store/card/energy-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_2 = require("../../game/store/card/card-types");
class Dedenne extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Tail Generation',
                cost: [L],
                damage: 0,
                text: 'For each Energy attached to all of your opponent\'s Pokemon, you may attach a Basic [L] Energy from your discard pile to your [L] Pokemon in any way you like.'
            },
            {
                name: 'Thunder Shock',
                cost: [L, C],
                damage: 30,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokemon is now Paralyzed.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Dedenne';
        this.fullName = 'Dedenne M3';
    }
    reduceEffect(store, state, effect) {
        // Tail Generation - attach Basic Lightning Energy from discard for each energy on opponent's Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Count total energies on opponent's Pokemon
            let totalEnergies = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                totalEnergies += cardList.energies.cards.length;
            });
            if (totalEnergies === 0) {
                return state;
            }
            // Count Basic Lightning Energy in discard
            const lightningEnergyInDiscard = player.discard.cards.filter(c => c instanceof energy_card_1.EnergyCard &&
                c.energyType === card_types_1.EnergyType.BASIC &&
                c.provides.includes(card_types_1.CardType.LIGHTNING));
            if (lightningEnergyInDiscard.length === 0) {
                return state;
            }
            const maxToAttach = Math.min(totalEnergies, lightningEnergyInDiscard.length);
            // Find Lightning Pokemon to attach to
            const lightningPokemon = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                const pokemonCard = cardList.getPokemonCard();
                if (pokemonCard && pokemonCard.cardType === card_types_1.CardType.LIGHTNING) {
                    lightningPokemon.push(cardList);
                }
            });
            if (lightningPokemon.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_2.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, provides: [card_types_1.CardType.LIGHTNING] }, { allowCancel: false, min: 0, max: maxToAttach }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        // Thunder Shock - coin flip for paralysis
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const coinFlipEffect = new play_card_effects_1.CoinFlipEffect(player, (result) => {
                if (result === true) {
                    (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                }
            });
            return store.reduceEffect(state, coinFlipEffect);
        }
        return state;
    }
}
exports.Dedenne = Dedenne;
