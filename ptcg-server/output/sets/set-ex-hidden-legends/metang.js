"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metang = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Metang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Beldum';
        this.cardType = M;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Metal Load',
                cost: [C],
                damage: 0,
                text: 'Search your discard pile for a [M] Energy card and attach it to Metang.',
            },
            {
                name: 'Metal Claw',
                cost: [M, C],
                damage: 30,
                text: ''
            }];
        this.set = 'HL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Metang';
        this.fullName = 'Metang HL 21';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, name: 'Metal Energy' }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.attacks[0] });
                }
            });
        }
        return state;
    }
}
exports.Metang = Metang;
