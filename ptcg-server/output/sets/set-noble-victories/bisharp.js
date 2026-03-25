"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bisharp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bisharp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pawniard';
        this.cardType = M;
        this.hp = 100;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Energy Stream',
                cost: [C],
                damage: 20,
                text: 'Attach a [M] Energy card from your discard pile to this Pokémon.'
            },
            {
                name: 'Metal Scissors',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Does 20 more damage for each [M] Energy attached to this Pokémon.'
            }];
        this.set = 'NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Bisharp';
        this.fullName = 'Bisharp NVI';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasMetalEnergyInDiscard = player.discard.cards.some(c => {
                return c.superType === card_types_1.SuperType.ENERGY
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides && c.provides.includes(card_types_1.CardType.METAL);
            });
            if (!hasMetalEnergyInDiscard) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Metal Energy' }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                if (transfers.length > 0) {
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.discard.moveCardTo(transfer.card, target);
                    }
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let metalEnergyCount = 0;
            player.active.cards.forEach(card => {
                if (card.superType === card_types_1.SuperType.ENERGY && card.provides && card.provides.includes(card_types_1.CardType.METAL)) {
                    metalEnergyCount++;
                }
            });
            effect.damage += 20 * metalEnergyCount;
        }
        return state;
    }
}
exports.Bisharp = Bisharp;
