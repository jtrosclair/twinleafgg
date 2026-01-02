"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venusaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const move_energy_prompt_1 = require("../../game/store/prompts/move-energy-prompt");
const __1 = require("../..");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Venusaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Ivysaur';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Energy Trans',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEMON_POWER,
                text: 'As often as you like during your turn (before your attack), you may take 1 [G] Energy card attached to 1 of your Pokémon and attach it to a different one. This power can\'t be used if Venusaur is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Solarbeam',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 60,
                text: ''
            }];
        this.set = 'BS';
        this.setNumber = '15';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Venusaur';
        this.fullName = 'Venusaur BS';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (prefabs_1.IS_POKEPOWER_BLOCKED(store, state, player, this)) {
                throw new __1.GameError(__1.GameMessage.BLOCKED_BY_EFFECT);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            const blockedMap = [];
            player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                const blockedCards = [];
                checkProvidedEnergy.energyMap.forEach(em => {
                    if (!em.provides.includes(card_types_1.CardType.GRASS) && !em.provides.includes(card_types_1.CardType.ANY)) {
                        blockedCards.push(em.card);
                    }
                });
                cardList.cards.forEach(em => {
                    if (cardList.getPokemons().includes(em)) {
                        blockedCards.push(em);
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
            store.prompt(state, new move_energy_prompt_1.MoveEnergyPrompt(effect.player.id, __1.GameMessage.MOVE_ENERGY_CARDS, __1.PlayerType.BOTTOM_PLAYER, [__1.SlotType.BENCH, __1.SlotType.ACTIVE], {}, { allowCancel: true, blockedMap }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = __1.StateUtils.getTarget(state, player, transfer.from);
                    const target = __1.StateUtils.getTarget(state, player, transfer.to);
                    if (transfer.card instanceof pokemon_card_1.PokemonCard) {
                        // If card is in source energies, move it from there; otherwise move from main cards array
                        if (source.energies.cards.includes(transfer.card)) {
                            source.energies.moveCardTo(transfer.card, target.energies);
                            // Also ensure it's in target's main cards array
                            if (!target.cards.includes(transfer.card)) {
                                target.cards.push(transfer.card);
                            }
                        }
                        else {
                            source.moveCardTo(transfer.card, target);
                            if (!target.energies.cards.includes(transfer.card)) {
                                target.energies.cards.push(transfer.card);
                            }
                        }
                    }
                    else {
                        source.moveCardTo(transfer.card, target);
                    }
                }
            });
        }
        return state;
    }
}
exports.Venusaur = Venusaur;
