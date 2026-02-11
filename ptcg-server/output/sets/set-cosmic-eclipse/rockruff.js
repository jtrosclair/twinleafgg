"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rockruff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Rockruff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Roar',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.'
            },
            {
                name: 'Rock Throw',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'CEC';
        this.setNumber = '123';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Rockruff';
        this.fullName = 'Rockruff CEC';
        this.usedRoar = false;
    }
    reduceEffect(store, state, effect) {
        // Roar
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.usedRoar = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedRoar === true) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benched = opponent.bench.filter(b => b.cards.length > 0);
            if (benched.length === 0) {
                return state;
            }
            state = store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
                this.usedRoar = false;
                if (!targets || targets.length === 0) {
                    return;
                }
                opponent.switchPokemon(targets[0]);
            });
            return state;
        }
        return state;
    }
}
exports.Rockruff = Rockruff;
