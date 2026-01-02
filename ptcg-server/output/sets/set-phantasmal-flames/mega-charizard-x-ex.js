"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaCharizardXex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaCharizardXex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Charmeleon';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = R;
        this.hp = 360;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Inferno X',
                cost: [R, R],
                damage: 90,
                damageCalculation: 'x',
                text: 'Discard any amount of [R] Energy from among your Pokémon, and this attack does 90 damage for each card you discarded in this way.',
            }];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.setNumber = '13';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Charizard X ex';
        this.fullName = 'Mega Charizard X ex M2';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let totalEnergy = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const basicEnergyCount = cardList.cards.filter(card => card instanceof game_1.EnergyCard && (card.provides.includes(game_1.CardType.FIRE) || card.provides.includes(game_1.CardType.ANY))).length;
                totalEnergy += basicEnergyCount;
            });
            // Create blocked map for energy that doesn't provide Fire or Any type
            const blockedFrom = [];
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const blockedIndices = [];
                cardList.cards.forEach((energyCard, index) => {
                    if (energyCard instanceof game_1.EnergyCard) {
                        // Block energy that doesn't provide Fire or Any type
                        if (!energyCard.provides.includes(game_1.CardType.FIRE) && !energyCard.provides.includes(game_1.CardType.ANY)) {
                            blockedIndices.push(index);
                        }
                    }
                });
                if (blockedIndices.length > 0) {
                    blockedMap.push({ source: target, blocked: blockedIndices });
                }
            });
            return store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], // Card source is target Pokemon
            { superType: game_1.SuperType.ENERGY }, { min: 1, max: totalEnergy, allowCancel: false, blockedFrom, blockedMap }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    let totalDiscarded = 0;
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = player.discard;
                    source.moveCardTo(transfer.card, target);
                    totalDiscarded = transfers.length;
                    effect.damage = totalDiscarded * 90;
                }
                return state;
            });
        }
        return state;
    }
}
exports.MegaCharizardXex = MegaCharizardXex;
