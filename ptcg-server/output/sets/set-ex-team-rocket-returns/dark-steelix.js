"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkSteelix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DarkSteelix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Onix';
        this.tags = [card_types_1.CardTag.DARK];
        this.cardType = M;
        this.additionalCardTypes = [D];
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C, C];
        this.attacks = [{
                name: 'Energy Link',
                cost: [C, C],
                damage: 20,
                text: 'Search your discard pile for an Energy card and attach it to Dark Steelix.'
            },
            {
                name: 'Heavy Impact',
                cost: [F, C, C, C],
                damage: 60,
                text: ''
            }];
        this.set = 'TRR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Dark Steelix';
        this.fullName = 'Dark Steelix TRR';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (!player.discard.cards.some(card => card.superType === card_types_1.SuperType.ENERGY)) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.DarkSteelix = DarkSteelix;
