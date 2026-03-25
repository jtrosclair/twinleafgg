"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperPotion = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* playCard(next, store, state, effect, self) {
    const player = effect.player;
    const blocked = [];
    let hasPokemonWithDamage = false;
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const energyCount = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, energyCount);
        if (cardList.damage === 0 || energyCount.energyMap.length < 2) {
            blocked.push(target);
        }
        else {
            hasPokemonWithDamage = true;
        }
    });
    if (hasPokemonWithDamage === false) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    // Do not discard the card yet
    effect.preventDefault = true;
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    targets.forEach(target => {
        // Heal Pokemon
        const healEffect = new game_effects_1.HealEffect(player, target, 120);
        store.reduceEffect(state, healEffect);
        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, target);
        state = store.reduceEffect(state, checkProvidedEnergy);
        const energyList = [];
        for (let i = 0; i < 2; i++) {
            energyList.push(card_types_1.CardType.COLORLESS);
        }
        state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, energyList, { allowCancel: false }), energy => {
            const cards = (energy || []).map(e => e.card);
            (0, prefabs_1.MOVE_CARDS)(store, state, target, player.discard, { cards: cards, sourceCard: self });
        });
    });
    return state;
}
class HyperPotion extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'D';
        this.set = 'CPA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '54';
        this.name = 'Hyper Potion';
        this.fullName = 'Hyper Potion CPA';
        this.text = 'Heal 120 damage from 1 of your Pokémon that has at least 2 Energy attached. If you healed any damage in this way, discard 2 Energy from it.';
    }
    canPlay(store, state, player) {
        let hasPokemonWithDamage = false;
        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            const energyCount = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            store.reduceEffect(state, energyCount);
            if (energyCount.energyMap.length >= 2 && cardList.damage !== 0) {
                hasPokemonWithDamage = true;
            }
        });
        if (hasPokemonWithDamage === false) {
            return false;
        }
        return true;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect, this);
            return generator.next().value;
        }
        return state;
    }
}
exports.HyperPotion = HyperPotion;
