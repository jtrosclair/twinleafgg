"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salazzleex = void 0;
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Salazzleex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Salandit';
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = R;
        this.hp = 260;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Nasty Plot',
                cost: [R],
                damage: 0,
                text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Fatal Nail',
                cost: [R, R],
                damage: 100,
                text: 'Your opponent\'s Active Pokemon is now Poisoned and Burned. Switch this Pokemon with 1 of your Benched Pokemon.'
            }];
        this.regulationMark = 'J';
        this.set = 'M3';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Salazzle ex';
        this.fullName = 'Salazzle ex M3';
    }
    reduceEffect(store, state, effect) {
        // Nasty Plot - Search deck for up to 2 cards
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            const maxCards = Math.min(2, player.deck.cards.length);
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: maxCards, allowCancel: false }), selected => {
                cards = selected || [];
                player.deck.moveCardsTo(cards, player.hand);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        // Fatal Nail - Poison + Burn
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Poison and burn opponent's active
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED)(store, state, effect);
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, opponent, this);
        }
        // Fatal Nail - Switch (after attack)
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Switch this Pokemon with benched Pokemon
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench) {
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                    const targets = selected || [];
                    if (targets.length > 0) {
                        player.active.clearEffects();
                        player.switchPokemon(targets[0]);
                    }
                });
            }
        }
        return state;
    }
}
exports.Salazzleex = Salazzleex;
