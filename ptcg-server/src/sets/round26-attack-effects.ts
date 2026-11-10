import { ConfirmPrompt, GameMessage, SpecialCondition, State } from '../game';
import { AttackEffect } from '../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../game/store/effects/attack-effects';
import { afterAttackDamage } from '../game/store/prefabs/attack-after-damage';
import { COIN_FLIP_PROMPT, SWITCH_ACTIVE_WITH_BENCHED } from '../game/store/prefabs/prefabs';

/** Resolve a coin-dependent condition against the original defending Pokémon. */
export function coinConditionsAfterDamage(state: State, attack: AttackEffect, heads: SpecialCondition[], tails: SpecialCondition[]): void {
  const slot = attack.opponent.active, defender = slot.getPokemonCard();
  afterAttackDamage(state, attack, (store, next) => COIN_FLIP_PROMPT(store, next, attack.player, result => {
    if (!defender || attack.opponent.active !== slot || slot.getPokemonCard() !== defender) return;
    const conditions = result ? heads : tails;
    if (!conditions.length) return;
    const add = new AddSpecialConditionsEffect(attack, conditions); add.target = slot;
    store.reduceEffect(next, add);
  }));
}

/** Flip after damage; recoil remains with the original physical attacker. */
export function coinRecoilAfterDamage(state: State, attack: AttackEffect, amount: number): void {
  const slot = attack.source, attacker = slot.getPokemonCard();
  afterAttackDamage(state, attack, (store, next) => COIN_FLIP_PROMPT(store, next, attack.player, heads => {
    if (heads || !attacker || slot.getPokemonCard() !== attacker || !next.players.some(p => p.active === slot || p.bench.includes(slot))) return;
    const selfAttack = new AttackEffect(attack.player, attack.opponent, attack.attack);
    selfAttack.source = slot; selfAttack.ignoreWeakness = true; selfAttack.ignoreResistance = true;
    const damage = new DealDamageEffect(selfAttack, amount); damage.target = slot;
    store.reduceEffect(next, damage);
  }));
}

/** Let the attacker choose whether to switch only while it remains Active. */
export function optionalSelfSwitchAfterDamage(state: State, attack: AttackEffect): void {
  const player = attack.player, slot = attack.source, attacker = slot.getPokemonCard();
  afterAttackDamage(state, attack, (store, next) => {
    if (!attacker || player.active !== slot || slot.getPokemonCard() !== attacker || !player.bench.some(p => p.cards.length > 0)) return next;
    return store.prompt(next, new ConfirmPrompt(player.id, GameMessage.WANT_TO_SWITCH_POKEMON), yes => {
      if (yes && player.active === slot && slot.getPokemonCard() === attacker) SWITCH_ACTIVE_WITH_BENCHED(store, next, player);
    });
  });
}
