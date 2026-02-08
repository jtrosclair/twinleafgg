"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shaymin = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Shaymin extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [];
        this.attacks = [{
                name: 'Flower Delivery',
                cost: [G],
                damage: 0,
                text: 'Search your deck for an Energy and attach it to 1 of your Benched [G] Pokemon. Then, shuffle your deck.'
            },
            {
                name: 'Leaf Step',
                cost: [G],
                damage: 30,
                text: ''
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Shaymin';
        this.fullName = 'Shaymin M3';
    }
    reduceEffect(store, state, effect) {
        // Flower Delivery - search deck for Energy, attach to benched Grass Pokemon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check if there are any benched Grass Pokemon
            const hasGrassBench = player.bench.some(bench => {
                const pokemonCard = bench.getPokemonCard();
                return pokemonCard && pokemonCard.cardType === game_1.CardType.GRASS;
            });
            if (!hasGrassBench) {
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1, differentTargets: false }), transfers => {
                transfers = transfers || [];
                // Filter to only allow attaching to Grass Pokemon
                const validTransfers = transfers.filter(transfer => {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    const pokemonCard = target.getPokemonCard();
                    return pokemonCard && pokemonCard.cardType === game_1.CardType.GRASS;
                });
                if (validTransfers.length > 0) {
                    for (const transfer of validTransfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.deck.moveCardTo(transfer.card, target);
                    }
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Shaymin = Shaymin;
