import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType, State } from '../../game';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';

/** Resolve printed damage against one chosen opposing Pokémon after main damage. */
export function targetedDamageAfterAttack(state: State, attack: AttackEffect, amount: number, benchOnly: boolean): void {
  const opponent = attack.opponent;
  afterAttackDamage(state, attack, (store, next) => {
    const valid = () => benchOnly ? opponent.bench.filter(slot => !!slot.getPokemonCard()) :
      [opponent.active, ...opponent.bench].filter(slot => !!slot.getPokemonCard());
    if (!valid().length) return next;
    return store.prompt(next, new ChoosePokemonPrompt(attack.player.id, GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      PlayerType.TOP_PLAYER, benchOnly ? [SlotType.BENCH] : [SlotType.ACTIVE, SlotType.BENCH],
      { min: 1, max: 1, allowCancel: false }), selected => {
        const target = selected && selected[0];
        if (!target || !valid().includes(target)) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        const damage = target === opponent.active ? new DealDamageEffect(attack, amount) : new PutDamageEffect(attack, amount);
        damage.target = target;
        return store.reduceEffect(next, damage);
      });
  });
}
