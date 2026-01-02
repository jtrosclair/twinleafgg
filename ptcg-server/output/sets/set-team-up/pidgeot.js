"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgeot = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Pidgeot extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Pidgeotto';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Whirlwind',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.'
            },
            {
                name: 'Spin Storm',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Your opponent puts their Active Pokémon and all cards attached to it into their hand.'
            }
        ];
        this.set = 'TEU';
        this.setNumber = '124';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Pidgeot';
        this.fullName = 'Pidgeot TEU';
        this.usedWhirlwind = false;
    }
    reduceEffect(store, state, effect) {
        // Whirlwind
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.usedWhirlwind = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedWhirlwind === true) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            if (benched.length === 0) {
                return state;
            }
            state = store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                this.usedWhirlwind = false;
                if (!targets || targets.length === 0) {
                    return;
                }
                // Use switchPokemon method for switching
                opponent.switchPokemon(targets[0]);
            });
            return state;
        }
        // Spin Storm
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const opponent = effect.opponent;
            const active = opponent.active;
            if (active.cards.length > 0) {
                opponent.hand.moveCardsTo(active.cards.slice(), opponent.hand);
                active.cards = [];
            }
            return state;
        }
        return state;
    }
}
exports.Pidgeot = Pidgeot;
