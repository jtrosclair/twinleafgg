"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeraoraGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ZeraoraGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.cardType = L;
        this.hp = 190;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Thunderclap Zone',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each of your Pokémon that has any [L] Energy attached to it has no Retreat Cost.'
            }];
        this.attacks = [{
                name: 'Plasma Fists',
                cost: [L, L, C],
                damage: 160,
                text: 'This Pokémon can\'t attack during your next turn.'
            },
            {
                name: 'Full Voltage-GX',
                cost: [L],
                damage: 0,
                text: 'Attach 5 basic Energy cards from your discard pile to your Pokémon in any way you like. (You can\'t use more than 1 GX attack in a game.)'
            }];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '201';
        this.name = 'Zeraora-GX';
        this.fullName = 'Zeraora GX LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            // Check to see if anything is blocking our Ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            let isZeraoraGXInPlay = false;
            owner.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isZeraoraGXInPlay = true;
                }
            });
            if (!isZeraoraGXInPlay) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            checkProvidedEnergy.energyMap.forEach(energy => {
                if (energy.provides.includes(L)) {
                    effect.cost = [];
                    return state;
                }
                if (energy.provides.includes(card_types_1.CardType.ANY)) {
                    effect.cost = [];
                    return state;
                }
            });
        }
        // Plasma Fists
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c.superType === card_types_1.SuperType.ENERGY
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(L);
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            (0, prefabs_1.BLOCK_IF_GX_ATTACK_USED)(player);
            player.usedGX = true;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { allowCancel: true, min: 1, max: 5 }), transfers => {
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
exports.ZeraoraGX = ZeraoraGX;
