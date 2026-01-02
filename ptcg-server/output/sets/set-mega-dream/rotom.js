"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rotom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* useRotocall(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    // Find available bench slots
    const benchSlots = player.bench.filter(slot => slot.cards.length === 0);
    if (benchSlots.length === 0) {
        // No bench space available
        return state;
    }
    // Find Rotom Pokemon in deck
    const rotomPokemon = player.deck.cards.filter((card, index) => {
        return card instanceof pokemon_card_1.PokemonCard && card.name.includes('Rotom');
    });
    if (rotomPokemon.length === 0) {
        // No Rotom Pokemon in deck, just shuffle
        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
        });
    }
    // Create blocked array for non-Rotom Pokemon
    const blocked = [];
    player.deck.cards.forEach((card, index) => {
        if (!(card instanceof pokemon_card_1.PokemonCard && card.name.includes('Rotom'))) {
            blocked.push(index);
        }
    });
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: Math.min(rotomPokemon.length, benchSlots.length), allowCancel: false, blocked }), selected => {
        cards = selected || [];
        next();
    });
    // Place selected cards on bench using PlayPokemonFromDeckEffect
    if (cards.length > 0) {
        cards.forEach((card, index) => {
            if (index < benchSlots.length) {
                const playPokemonFromDeckEffect = new play_card_effects_1.PlayPokemonFromDeckEffect(player, card, benchSlots[index]);
                store.reduceEffect(state, playPokemonFromDeckEffect);
            }
        });
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Rotom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Rotocall',
                cost: [C],
                damage: 0,
                text: 'Search your deck for as many cards with Rotom in their name as you like, and place them onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Gadget Show',
                cost: [C, C],
                damage: 0,
                damageCalculation: 'x',
                text: '30x damage. This attack does 30 damage for each Pokemon Tool attached to all your Pokemon.'
            }];
        this.regulationMark = 'I';
        this.set = 'M2a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '76';
        this.name = 'Rotom';
        this.fullName = 'Rotom M2a';
    }
    reduceEffect(store, state, effect) {
        // Rotocall attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useRotocall(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        // Gadget Show attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let toolCount = 0;
            // Count tools on all player's Pokemon
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                cardList.tools.forEach(card => {
                    if (card instanceof trainer_card_1.TrainerCard && card.trainerType === card_types_1.TrainerType.TOOL) {
                        toolCount++;
                    }
                });
            });
            effect.damage = 30 * toolCount;
        }
        return state;
    }
}
exports.Rotom = Rotom;
