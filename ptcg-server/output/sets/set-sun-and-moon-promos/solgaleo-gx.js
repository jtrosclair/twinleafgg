"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolgaleoGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class SolgaleoGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Cosmoem';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 250;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Shining Mane',
                powerType: __1.PowerType.ABILITY,
                text: 'Your Pokémon in play have no Weakness.'
            }];
        this.attacks = [{
                name: 'Turbo Strike',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Attach 2 basic Energy cards from your discard pile to 1 of your Benched Pokémon.'
            },
            {
                name: 'Prominence-GX',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                gxAttack: true,
                text: 'Heal all damage from all of your Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'SMP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '104';
        this.name = 'Solgaleo-GX';
        this.fullName = 'Solgaleo-GX SMP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonStatsEffect) {
            const player = __1.StateUtils.findOwner(state, effect.target);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            let isSolgaleoInPlay = false;
            player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isSolgaleoInPlay = true;
                }
            });
            if (isSolgaleoInPlay) {
                effect.weakness = [];
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof __1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                return state;
            }
            if (!hasBench) {
                return state;
            }
            state = store.prompt(state, new __1.AttachEnergyPrompt(player.id, __1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, __1.PlayerType.BOTTOM_PLAYER, [__1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 2, max: 2, sameTarget: true }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = __1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, cardList.damage);
                state = store.reduceEffect(state, healEffect);
            });
        }
        return state;
    }
}
exports.SolgaleoGX = SolgaleoGX;
