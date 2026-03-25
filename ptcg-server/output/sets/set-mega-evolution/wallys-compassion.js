"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WallysCompassion = void 0;
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* playCard(next, store, state, effect) {
    const player = effect.player;
    if (player.supporterTurn > 0) {
        throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
    }
    const blocked = [];
    let hasMegaPokemon = false;
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA) && card.tags.includes(card_types_1.CardTag.POKEMON_ex) && cardList.damage > 0) {
            hasMegaPokemon = true;
        }
        else {
            blocked.push(target);
        }
    });
    if (!hasMegaPokemon) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let targets = [];
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
        targets = results || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    const target = targets[0];
    const healEffect = new game_effects_1.HealEffect(player, target, target.damage);
    store.reduceEffect(state, healEffect);
    const energy = target.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
    target.moveCardsTo(energy, player.hand);
    return state;
}
class WallysCompassion extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'MEG';
        this.setNumber = '132';
        this.regulationMark = 'I';
        this.name = 'Wally\'s Compassion';
        this.fullName = 'Wally\'s Compassion M1S';
        this.text = 'Heal all damage from 1 of your Mega Evolution Pokémon ex. If you do, put all Energy attached to that Pokémon back into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const generator = playCard(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.WallysCompassion = WallysCompassion;
