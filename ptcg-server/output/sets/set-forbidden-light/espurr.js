"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espurr = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Espurr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Energy Teaser',
                cost: [P],
                damage: 0,
                text: 'Move an Energy from 1 of your opponent\'s Benched Pokémon to another of their Pokémon.'
            }];
        this.set = 'FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Espurr';
        this.fullName = 'Espurr FLI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let hasEnergy = false;
            let pokemonCount = 0;
            const blockedFrom = [];
            pokemonCount = 0;
            hasEnergy = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                pokemonCount += 1;
                if (cardList === opponent.active) {
                    blockedFrom.push(target);
                    return;
                }
                const energyAttached = cardList.cards.some(c => {
                    return c instanceof game_1.EnergyCard;
                });
                hasEnergy = hasEnergy || energyAttached;
            });
            if (!hasEnergy || pokemonCount <= 1) {
                return state;
            }
            let transfers = [];
            store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blockedFrom }), result => {
                transfers = result || [];
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
exports.Espurr = Espurr;
