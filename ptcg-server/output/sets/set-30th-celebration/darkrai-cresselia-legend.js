"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkraiCresseliaLegendBottomCC17 = exports.DarkraiCresseliaLegendTopCC16 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const effect_of_attack_effects_1 = require("../../game/store/effects/effect-of-attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const choose_energy_prompt_1 = require("../../game/store/prompts/choose-energy-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const moon_invite_damage_prompt_1 = require("./moon-invite-damage-prompt");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
// Probe both affected Pokemon before an atomic counter transfer; protection on
// either end must prevent the move, not create/remove counters.
class MoonInviteMoveEffect extends effect_of_attack_effects_1.EffectOfAttackEffect {
    constructor() {
        super(...arguments);
        this.type = 'MOON_INVITE_MOVE_EFFECT';
    }
    applyEffect() { }
}
class LostCrisisEnergyPrompt extends choose_energy_prompt_1.ChooseEnergyPrompt {
    validate(result) {
        return result !== null && result.every(e => this.energy.includes(e))
            && new Set(result.map(e => e.card)).size === result.length && super.validate(result);
    }
}
// Both physical halves expose the composite text, as do the existing LEGEND pairs.
// Only the top half is the in-play Pokemon after assembly (bottom, then top).
class DarkraiCresseliaLegend extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.LEGEND;
        this.tags = [card_types_1.CardTag.LEGEND, card_types_1.CardTag.DUAL_LEGEND];
        this.cardType = card_types_1.CardType.DARK;
        this.additionalCardTypes = [card_types_1.CardType.PSYCHIC];
        this.hp = 150;
        // Printed bottom-half artwork has BOTH Fighting and Psychic weakness.
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }, { type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Legend Assembly',
                text: 'Put this card from your hand onto your Bench only with the other half of Darkrai & Cresselia LEGEND.',
                exemptFromAbilityLock: true, useFromHand: true, powerType: pokemon_types_1.PowerType.LEGEND_ASSEMBLY
            }];
        this.attacks = [{
                name: 'Lost Crisis', cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 100,
                text: 'Choose 2 Energy attached to Darkrai & Cresselia LEGEND and put them in the Lost Zone. If any of your opponent\'s Pokémon would be Knocked Out by damage from this attack, put that Pokémon and all cards attached to it in the Lost Zone instead of discarding it.'
            }, {
                name: 'Moon\'s Invite', cost: [card_types_1.CardType.PSYCHIC], damage: 0,
                text: 'Move as many damage counters on your opponent\'s Pokémon as you like to any of your opponent\'s other Pokémon in any way you like.'
            }];
        this.set = '30C';
        this.name = 'Darkrai & Cresselia LEGEND';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.card === this && effect.power === this.powers[0]) {
            const player = effect.player;
            const slot = player.bench.find(b => b.cards.length === 0);
            const counterpart = player.hand.cards.find(c => c instanceof DarkraiCresseliaLegend && c.half !== this.half);
            if (!player.hand.cards.includes(this) || !slot || !counterpart) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const top = this.half === 'top' ? this : counterpart;
            const bottom = this.half === 'bottom' ? this : counterpart;
            player.hand.moveCardTo(bottom, slot);
            player.hand.moveCardTo(top, slot);
            slot.pokemonPlayedTurn = state.turn;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const energy = new check_effects_1.CheckProvidedEnergyEffect(effect.player, effect.source);
            store.reduceEffect(state, energy);
            const cost = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
            if (!state_utils_1.StateUtils.checkEnoughEnergy(energy.energyMap, cost)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.NOT_ENOUGH_ENERGY);
            }
            const damage = effect.damage;
            effect.damage = 0;
            const prompt = new LostCrisisEnergyPrompt(effect.player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, energy.energyMap, cost, { allowCancel: false });
            return store.prompt(state, prompt, selected => {
                if (!prompt.validate(selected)) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
                }
                const cards = Array.from(new Set(selected.map(e => e.card)));
                (0, prefabs_1.MOVE_CARDS)(store, state, effect.source, effect.player.lostzone, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
                if (!cards.every(c => effect.player.lostzone.cards.includes(c))) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
                }
                effect.damage = damage;
                effect.damageKnockOutsToLostZone = true;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const opponent = effect.opponent;
            const targets = [];
            let total = 0;
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (slot, card, target) => {
                total += slot.damage;
                targets.push({ target, damage: 0 });
            });
            if (targets.length < 2 || total === 0) {
                return state;
            }
            targets.forEach(t => t.damage = total);
            const prompt = new moon_invite_damage_prompt_1.MoonInviteDamagePrompt(effect.player.id, game_message_1.GameMessage.MOVE_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], targets, { allowCancel: true });
            return store.prompt(state, prompt, transfers => {
                if (!prompt.validate(transfers, state)) {
                    throw new game_error_1.GameError(game_message_1.GameMessage.INVALID_PROMPT_RESULT);
                }
                if (!transfers) {
                    return;
                }
                for (const transfer of transfers) {
                    const from = state_utils_1.StateUtils.getTarget(state, effect.player, transfer.from);
                    const to = state_utils_1.StateUtils.getTarget(state, effect.player, transfer.to);
                    const remove = new MoonInviteMoveEffect(effect);
                    remove.target = from;
                    const place = new MoonInviteMoveEffect(effect);
                    place.target = to;
                    store.reduceEffect(state, remove);
                    store.reduceEffect(state, place);
                    if (!remove.preventDefault && !place.preventDefault) {
                        from.damage -= 10;
                        to.damage += 10;
                    }
                }
            });
        }
        return state;
    }
}
class DarkraiCresseliaLegendTopCC16 extends DarkraiCresseliaLegend {
    constructor() {
        super(...arguments);
        this.half = 'top';
        this.setNumber = 'CC16';
        this.usSetNumber = '30C CC16';
        this.fullName = 'Darkrai & Cresselia LEGEND (Top) 30C CC16';
    }
}
exports.DarkraiCresseliaLegendTopCC16 = DarkraiCresseliaLegendTopCC16;
class DarkraiCresseliaLegendBottomCC17 extends DarkraiCresseliaLegend {
    constructor() {
        super(...arguments);
        this.half = 'bottom';
        this.setNumber = 'CC17';
        this.usSetNumber = '30C CC17';
        this.fullName = 'Darkrai & Cresselia LEGEND (Bottom) 30C CC17';
    }
}
exports.DarkraiCresseliaLegendBottomCC17 = DarkraiCresseliaLegendBottomCC17;
