"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inteleon = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Inteleon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.RAPID_STRIKE];
        this.regulationMark = 'D';
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Drizzile';
        this.cardType = game_1.CardType.WATER;
        this.hp = 160;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Shady Dealings',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may search your deck for up to 2 Trainer cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Aqua Bullet',
                cost: [W, C],
                damage: 120,
                text: 'This attack also does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Inteleon';
        this.fullName = 'Inteleon SSH';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.TRAINER }, { min: 0, max: 2, allowCancel: false }), selected => {
                        const cards = selected || [];
                        store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                            player.deck.moveCardsTo(cards, player.hand);
                        });
                        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                    });
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(20, effect, store, state);
        }
        return state;
    }
}
exports.Inteleon = Inteleon;
