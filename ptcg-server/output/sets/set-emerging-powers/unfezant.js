"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unfezant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attach_energy_prompt_1 = require("../../game/store/prompts/attach-energy-prompt");
class Unfezant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Tranquill';
        this.cardType = C;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Tailwind',
                cost: [C],
                damage: 0,
                text: 'Attach an Energy from your hand to 1 of your Pokémon.'
            },
            {
                name: 'Feather Strike',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 40 more damage. If tails, discard an Energy attached to the Defending Pokémon.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '82';
        this.name = 'Unfezant';
        this.fullName = 'Unfezant EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => c.superType === card_types_1.SuperType.ENERGY);
            if (!hasEnergyInHand) {
                return state;
            }
            return store.prompt(state, new attach_energy_prompt_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    effect.damage += 40;
                }
                else {
                    const energyCards = opponent.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                    if (energyCards.length > 0) {
                        opponent.active.moveCardTo(energyCards[0], opponent.discard);
                    }
                }
            });
        }
        return state;
    }
}
exports.Unfezant = Unfezant;
