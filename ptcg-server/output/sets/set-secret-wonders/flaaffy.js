"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flaaffy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Flaaffy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mareep';
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: F, value: +20 }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Attract Current',
                cost: [C],
                damage: 10,
                text: 'Search your deck for a [L] Energy card and attach it to 1 of your Pokémon. Shuffle your deck afterward.'
            },
            {
                name: 'Electromagnetic Kick',
                cost: [L, L, C],
                damage: 60,
                text: 'Flip a coin. If tails, Flaaffy does 10 damage to itself.'
            }];
        this.set = 'SW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Flaaffy';
        this.fullName = 'Flaaffy SW';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, name: 'Lightning Energy' }, { allowCancel: true, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, effect.player, result => {
                if (!result) {
                    (0, prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF)(store, state, effect, 10);
                }
            });
        }
        return state;
    }
}
exports.Flaaffy = Flaaffy;
