"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiancasDevotion = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    if (player.supporterTurn > 0) {
        throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    const blocked = [];
    let hasValidTarget = false;
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        if (checkHpEffect.hp - cardList.damage > 30) {
            blocked.push(target);
        }
        else {
            hasValidTarget = true;
        }
    });
    if (!hasValidTarget) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    player.hand.moveCardTo(effect.trainerCard, player.supporter);
    let targets = [];
    yield store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    const target = targets[0];
    const healEffect = new game_effects_1.HealEffect(player, target, target.damage);
    store.reduceEffect(state, healEffect);
    return state;
}
class BiancasDevotion extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '142';
        this.regulationMark = 'H';
        this.name = 'Bianca\'s Devotion';
        this.fullName = 'Bianca\'s Devotion TEF';
        this.text = 'Heal all damage from 1 of your Pokémon that has 30 HP or less remaining.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.BiancasDevotion = BiancasDevotion;
