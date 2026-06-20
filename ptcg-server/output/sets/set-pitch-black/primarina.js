"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primarina = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const confirm_prompt_1 = require("../../game/store/prompts/confirm-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Primarina extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Brionne';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Max Melody',
                powerType: game_1.PowerType.ABILITY,
                text: 'You may use this Ability once during your turn when you play this card from your hand to evolve 1 of your Pokémon. Heal all damage from 1 of your Pokémon.',
            }];
        this.attacks = [{
                name: 'Aqua Return',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Return this Pokémon and all cards attached to it into your hand.',
            }];
        this.set = 'M5';
        this.setNumber = '19';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Primarina';
        this.fullName = 'Primarina M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-evolving-skies/ludicolo.ts (on-evolve PlayPokemonEffect), set-unbroken-bonds/dedenne-gx.ts (return to hand)
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            state = store.prompt(state, new confirm_prompt_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (!wantToUse) {
                    return;
                }
                store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1 }), picked => {
                    if (!picked || picked.length === 0) {
                        return;
                    }
                    const target = picked[0];
                    if (target.damage > 0) {
                        store.reduceEffect(state, new game_effects_1.HealEffect(player, target, target.damage));
                    }
                });
            });
            return state;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { allowCancel: false }), result => {
                const cardList = (result === null || result === void 0 ? void 0 : result.length) ? result[0] : null;
                if (!cardList) {
                    return;
                }
                const pokemons = cardList.getPokemons();
                cardList.moveCardsTo(pokemons, player.hand);
                cardList.moveTo(player.hand);
                cardList.clearEffects();
            });
        }
        return state;
    }
}
exports.Primarina = Primarina;
