"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mimikyu = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
function* useCopycat(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    // Get opponent's last attack info
    const lastAttackInfo = state.playerLastAttack[opponent.id];
    if (!lastAttackInfo) {
        return state;
    }
    const { attack: lastAttack, sourceCard } = lastAttackInfo;
    // Validate attack is copyable
    if (lastAttack.copycatAttack === true || lastAttack.gxAttack === true) {
        return state;
    }
    store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
        name: player.name,
        attack: lastAttack.name
    });
    // Create AttackEffect with Mimikyu as the attacker
    const copiedAttackEffect = new game_effects_1.AttackEffect(player, opponent, lastAttack);
    copiedAttackEffect.source = player.active;
    copiedAttackEffect.target = opponent.active;
    // CRITICAL: Call the source card's reduceEffect directly
    // This ensures the attack logic runs even if the card is not in play
    state = sourceCard.reduceEffect(store, state, copiedAttackEffect);
    // Handle any prompts from the attack
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    // Deal damage if applicable and not already handled
    if (copiedAttackEffect.damage > 0) {
        const dealDamage = new attack_effects_1.DealDamageEffect(copiedAttackEffect, copiedAttackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
    }
    // Create and process AfterAttackEffect (this is what triggers after-attack effects)
    const afterAttackEffect = new game_phase_effects_1.AfterAttackEffect(player, opponent, lastAttack);
    state = store.reduceEffect(state, afterAttackEffect);
    // Handle any prompts from the after-attack effect
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    return state;
}
class Mimikyu extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Filch',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Draw 2 cards.'
            }, {
                name: 'Copycat',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.COLORLESS],
                damage: 0,
                copycatAttack: true,
                text: 'If your opponent\'s Pokémon used an attack that isn\'t a GX attack during their last turn, use it as this attack.'
            }];
        this.set = 'GRI';
        this.name = 'Mimikyu';
        this.fullName = 'Mimikyu GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
    }
    reduceEffect(store, state, effect) {
        // if (effect instanceof EndTurnEffect) {
        //   // Only clear the copied reduceEffect when it's our turn ending
        //   const cardList = StateUtils.findCardList(state, this);
        //   const owner = StateUtils.findOwner(state, cardList);
        //   if (owner === effect.player) {
        //     console.log('Clearing copied reduceEffect and properties for Mimikyu');
        //     // Remove copiedReduceEffect and copiedProperties fields and logic
        //   }
        //   return state;
        // }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 2);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const generator = useCopycat(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Mimikyu = Mimikyu;
