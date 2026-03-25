"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klinklang = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
function* useShiftGear(next, store, state, effect) {
    const player = effect.player;
    // Build blocked map - only allow moving Metal energy
    const blockedMap = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergy);
        const blockedCards = [];
        checkProvidedEnergy.energyMap.forEach(em => {
            if (!em.provides.includes(card_types_1.CardType.METAL) && !em.provides.includes(card_types_1.CardType.ANY)) {
                blockedCards.push(em.card);
            }
        });
        const blocked = [];
        blockedCards.forEach(bc => {
            const index = cardList.cards.indexOf(bc);
            if (index !== -1 && !blocked.includes(index)) {
                blocked.push(index);
            }
        });
        if (blocked.length !== 0) {
            blockedMap.push({ source: target, blocked });
        }
    });
    return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 0, max: 1, blockedMap }), transfers => {
        if (transfers === null) {
            return;
        }
        for (const transfer of transfers) {
            const source = game_1.StateUtils.getTarget(state, player, transfer.from);
            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
            source.moveCardTo(transfer.card, target);
        }
    });
}
class Klinklang extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Klang';
        this.cardType = M;
        this.hp = 140;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Shift Gear',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As often as you like during your turn (before your attack), you may move a [M] Energy from 1 of your Pokémon to another of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Gear Saucer',
                cost: [M, M, C],
                damage: 80,
                text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Klinklang';
        this.fullName = 'Klinklang BLW';
    }
    reduceEffect(store, state, effect) {
        // Shift Gear ability
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            // Check if there's any Metal energy to move
            let hasMetalEnergy = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                checkProvidedEnergy.energyMap.forEach(em => {
                    if (em.provides.includes(card_types_1.CardType.METAL) || em.provides.includes(card_types_1.CardType.ANY)) {
                        hasMetalEnergy = true;
                    }
                });
            });
            if (!hasMetalEnergy) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const generator = useShiftGear(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        // Gear Saucer - damage to benched Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(20, effect, store, state);
        }
        return state;
    }
}
exports.Klinklang = Klinklang;
