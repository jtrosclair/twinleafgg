"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leafeon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Leafeon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Quick Attack',
                cost: [C],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            },
            {
                name: 'Energy Assist',
                cost: [G, C],
                damage: 40,
                text: 'Attach a basic Energy card from your discard pile to 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '6';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Leafeon';
        this.fullName = 'Leafeon DEX';
    }
    reduceEffect(store, state, effect) {
        // Quick Attack - flip for +30
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)(store, state, effect, 30);
        }
        // Energy Assist - attach basic energy from discard to benched
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC;
            });
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasEnergyInDiscard || !hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                if (transfers.length > 0) {
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.discard.moveCardTo(transfer.card, target);
                    }
                }
            });
        }
        return state;
    }
}
exports.Leafeon = Leafeon;
