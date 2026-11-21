import { GameMessage } from '../../game-message';
import { CardTarget, PlayerType, SlotType } from '../actions/play-card-action';
import { PutCountersEffect } from '../effects/attack-effects';
import { AttackEffect, MoveDamageCountersEffect, PlaceDamageCountersEffect, PowerEffect } from '../effects/game-effects';
import { ChoosePokemonPrompt } from '../prompts/choose-pokemon-prompt';
import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { afterAttackDamage } from './attack-after-damage';

export function canMoveDamageCounters(store: StoreLike, state: State, player: Player): boolean {
  const move = new MoveDamageCountersEffect(player);
  store.reduceEffect(state, move);
  return !move.preventDefault;
}

export function moveAbilityDamageCounters(
  store: StoreLike, state: State, power: PowerEffect, source: PokemonCardList, target: PokemonCardList, maximum: number,
): State {
  const damage = Math.floor(Math.min(source.damage, maximum) / 10) * 10;
  if (source === target || damage <= 0 || !source.getPokemonCard() || !target.getPokemonCard()
    || !canMoveDamageCounters(store, state, power.player)) return state;

  source.damage -= damage;
  return store.reduceEffect(state, new PlaceDamageCountersEffect(power.player, target, damage, power.card, power.power));
}

export function moveBenchedDamageCountersToDefender(
  state: State, attack: AttackEffect, message: GameMessage, eligible: (slot: PokemonCardList) => boolean,
): void {
  afterAttackDamage(state, attack, (store, resolvedState) => {
    const player = attack.player;
    const blocked: CardTarget[] = [];
    let needsSelection = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, _card, target) => {
      if (target.slot !== SlotType.BENCH) return;
      if (slot.damage >= 10 && eligible(slot)) needsSelection = true;
      else blocked.push(target);
    });
    if (!needsSelection || !canMoveDamageCounters(store, resolvedState, player)) return resolvedState;
    return store.prompt(resolvedState, new ChoosePokemonPrompt(
      player.id, message, PlayerType.BOTTOM_PLAYER, [SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }
    ), ([source]) => {
      if (!source || !player.bench.includes(source) || !eligible(source) || !attack.opponent.active.getPokemonCard()
        || !canMoveDamageCounters(store, resolvedState, player)) return;
      const placement = new PutCountersEffect(attack, source.damage);
      placement.target = attack.opponent.active;
      source.damage = 0;
      store.reduceEffect(resolvedState, placement);
    });
  });
}
