"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electrodeex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Electrodeex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Voltorb';
        this.cardType = L;
        this.hp = 90;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Extra Energy Bomb',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may discard Electrode ex and all the cards attached to it (this counts as Knocking Out Electrode ex). If you do, search your discard pile for 5 Energy cards and attach them to any of your Pokémon (excluding Pokémon-ex) in any way you like. This power can\'t be used if Electrode ex is affected by a Special Condition.'
            }];
        this.attacks = [
            {
                name: 'Crash and Burn',
                cost: [L, C],
                damage: 30,
                damageCalculation: '+',
                text: 'You may discard as many Energy as you like attached to your Pokémon in play. If you do, this attack does 30 damage plus 20 more damage for each Energy you discarded.'
            }
        ];
        this.set = 'RG';
        this.name = 'Electrode ex';
        this.fullName = 'Electrode ex RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
    }
    reduceEffect(store, state, effect) {
        //Versatile pokebody
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.damage += 999;
                    const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
                    store.reduceEffect(state, checkHpEffect);
                }
            });
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    blocked2.push(target);
                }
            });
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 5, blockedTo: blocked2 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    prefabs_1.MOVE_CARD_TO(state, transfer.card, target);
                }
            });
        }
        //Power Move attack
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let totalEnergy = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const energyCount = cardList.cards.filter(card => card instanceof game_1.EnergyCard).length;
                totalEnergy += energyCount;
            });
            return store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: totalEnergy, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return state;
                }
                // Move all selected energies to discard
                transfers.forEach(transfer => {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    source.moveCardTo(transfer.card, player.discard);
                });
                // Set damage based on number of discarded cards
                effect.damage += transfers.length * 20;
                return state;
            });
        }
        return state;
    }
}
exports.Electrodeex = Electrodeex;
