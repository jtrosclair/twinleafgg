"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ninjask = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ninjask extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nincada';
        this.cardType = G;
        this.hp = 60;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Cast-off Shell',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokemon from your hand to evolve 1 of your Pokemon, you may search your deck for Shedinja and put it onto your Bench. Shuffle your deck afterward.'
            }];
        this.attacks = [
            {
                name: 'Night Slash',
                cost: [G, C],
                damage: 60,
                text: 'You may switch this Pokemon with 1 of your Benched Pokemon.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '11';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ninjask';
        this.fullName = 'Ninjask DRX';
        this.usedNightSlash = false;
    }
    reduceEffect(store, state, effect) {
        // Ability: Cast-off Shell - When evolving, search for Shedinja
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            const slots = (0, prefabs_1.GET_PLAYER_BENCH_SLOTS)(player);
            if (slots.length === 0) {
                return state;
            }
            // Check if ability is blocked
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const blocked = [];
                    player.deck.cards.forEach((card, index) => {
                        if (!(card instanceof pokemon_card_1.PokemonCard) || card.name !== 'Shedinja') {
                            blocked.push(index);
                        }
                    });
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON }, { min: 0, max: 1, allowCancel: false, blocked }), selected => {
                        const cards = selected || [];
                        if (cards.length > 0) {
                            const benchSlots = (0, prefabs_1.GET_PLAYER_BENCH_SLOTS)(player);
                            if (benchSlots.length > 0) {
                                player.deck.moveCardTo(cards[0], benchSlots[0]);
                                benchSlots[0].pokemonPlayedTurn = state.turn;
                            }
                        }
                        (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    });
                }
            });
        }
        // Attack: Night Slash - Optional switch after damage
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            this.usedNightSlash = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedNightSlash) {
            this.usedNightSlash = false;
            const player = effect.player;
            if (player.bench.some((b) => b.cards.length > 0)) {
                return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToSwitch => {
                    if (wantToSwitch) {
                        (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
                    }
                });
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.usedNightSlash = false;
        }
        return state;
    }
}
exports.Ninjask = Ninjask;
