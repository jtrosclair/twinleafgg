"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Articuno = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Articuno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Blizzard Veil',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is your Active Pokémon, whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to your Benched [W] Pokémon.'
            }];
        this.attacks = [{
                name: 'Cold Cyclone',
                cost: [W, W],
                damage: 70,
                text: 'Move 2 [W] Energy from this Pokémon to 1 of your Benched Pokémon.'
            }];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Articuno';
        this.fullName = 'Articuno TEU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            // Count valid [W] Energy attached to Articuno
            const validTypes = [card_types_1.CardType.WATER, card_types_1.CardType.ANY, card_types_1.CardType.WLFM, card_types_1.CardType.GRW];
            const attachedEnergies = player.active.cards.filter(card => {
                // Only consider EnergyCard instances
                if (card.superType !== card_types_1.SuperType.ENERGY)
                    return false;
                // Check if card is an EnergyCard and provides a valid type
                const energyCard = card;
                return Array.isArray(energyCard.provides) && energyCard.provides.some((t) => validTypes.includes(t));
            });
            const numToMove = Math.min(2, attachedEnergies.length);
            if (numToMove === 0) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: numToMove, max: numToMove, validCardTypes: validTypes }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        if (effect instanceof play_card_effects_1.TrainerTargetEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!opponent.active.cards.includes(this) || prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            if (effect.target) {
                const pokemonCard = effect.target.getPokemonCard && effect.target.getPokemonCard();
                if (pokemonCard) {
                    const isWater = Array.isArray(pokemonCard.cardType)
                        ? pokemonCard.cardType.includes(card_types_1.CardType.WATER)
                        : pokemonCard.cardType === card_types_1.CardType.WATER;
                    if (isWater && opponent.bench.some(b => b === effect.target)) {
                        effect.preventDefault = true;
                    }
                }
            }
        }
        return state;
    }
}
exports.Articuno = Articuno;
