"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Silvally = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const choose_energy_prompt_1 = require("../../game/store/prompts/choose-energy-prompt");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Silvally extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Type: Null';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Buddy Call',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may use this Ability if you have no cards in your hand. Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.',
            }];
        this.attacks = [{
                name: 'Air Slash',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: 'Discard 1 Energy attached to this Pokémon.',
            }];
        this.set = 'M5';
        this.setNumber = '68';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Silvally';
        this.fullName = 'Silvally M5';
        this.BUDDY_MARKER = 'M5_SILVALLY_BUDDY';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            effect.player.marker.removeMarker(this.BUDDY_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.BUDDY_MARKER, this)) {
            effect.player.marker.removeMarker(this.BUDDY_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            if (player.marker.hasMarker(this.BUDDY_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.hand.cards.length !== 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.NO_CARDS_IN_DECK);
            }
            player.marker.addMarker(this.BUDDY_MARKER, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blocked = [];
            player.deck.cards.forEach((c, idx) => {
                if (!(c instanceof trainer_card_1.TrainerCard) || c.trainerType !== card_types_1.TrainerType.SUPPORTER) {
                    blocked.push(idx);
                }
            });
            if (blocked.length >= player.deck.cards.length) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, blocked, allowCancel: false }), picked => {
                const sel = picked || [];
                if (sel.length > 0) {
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, sel);
                    player.deck.moveCardsTo(sel, player.hand);
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const atk = effect;
            const check = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, check);
            return store.prompt(state, new choose_energy_prompt_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, check.energyMap, [card_types_1.CardType.COLORLESS], { allowCancel: false }), sel => {
                const cards = (sel || []).map(e => e.card).filter(Boolean);
                if (cards.length === 0) {
                    return;
                }
                const discard = new attack_effects_1.DiscardCardsEffect(atk, cards);
                discard.target = player.active;
                store.reduceEffect(state, discard);
            });
        }
        return state;
    }
}
exports.Silvally = Silvally;
