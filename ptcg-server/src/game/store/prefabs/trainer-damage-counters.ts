import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { CardTarget, PlayerType, SlotType } from '../actions/play-card-action';
import { MoveDamageCountersEffect, PlaceDamageCountersEffect } from '../effects/game-effects';
import { TrainerEffect } from '../effects/play-card-effects';
import { DamageMap, MoveDamagePrompt } from '../prompts/move-damage-prompt';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { StateUtils } from '../state-utils';
import { StoreLike } from '../store-like';
import { TRAINER_TARGET_BLOCKED } from './prefabs';

export function moveTrainerDamageCounters(
  store: StoreLike, state: State, effect: TrainerEffect, fromOwnActive: boolean,
): State {
  const { player } = effect;
  const opponent = StateUtils.getOpponent(state, player);
  const sources = fromOwnActive ? [player.active] : opponent.getPokemonInPlay();
  const targets = fromOwnActive ? [opponent.active] : sources;
  const damaged = sources.filter(slot => slot.getPokemonCard() && slot.damage >= 10);
  if (!damaged.some(source => targets.some(target => target !== source && target.getPokemonCard()))) {
    throw new GameError(GameMessage.CANNOT_MOVE_DAMAGE);
  }

  const moving = new MoveDamageCountersEffect(player);
  store.reduceEffect(state, moving);
  if (moving.preventDefault || damaged.every(source => TRAINER_TARGET_BLOCKED(store, state, effect, source))) {
    return state;
  }

  const blockedFrom: CardTarget[] = [];
  const blockedTo: CardTarget[] = [];
  const maxAllowedDamage: DamageMap[] = [];
  const collect = (slot: PokemonCardList, position: CardTarget): void => {
    if (!damaged.includes(slot)) blockedFrom.push(position);
    if (targets.includes(slot)) maxAllowedDamage.push({ target: position, damage: 9999 });
    else blockedTo.push(position);
  };
  if (fromOwnActive) {
    collect(player.active, { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 });
  }
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (slot, _card, position) => collect(slot, position));

  return store.prompt(state, new MoveDamagePrompt(
    player.id, GameMessage.MOVE_DAMAGE, fromOwnActive ? PlayerType.ANY : PlayerType.TOP_PLAYER,
    fromOwnActive ? [SlotType.ACTIVE] : [SlotType.ACTIVE, SlotType.BENCH],
    maxAllowedDamage, { min: 1, max: 3, allowCancel: false, blockedFrom, blockedTo,
      singleSourceTarget: true, singleDestinationTarget: true }
  ), transfers => {
    if (!transfers?.length) return;
    const { from, to } = transfers[0];
    const source = StateUtils.getTarget(state, player, from);
    const target = StateUtils.getTarget(state, player, to);
    if (source === target || !sources.includes(source) || !targets.includes(target)
      || !source.getPokemonCard() || !target.getPokemonCard()
      || TRAINER_TARGET_BLOCKED(store, state, effect, source)) return;

    const damage = Math.min(3, transfers.length, Math.floor(source.damage / 10)) * 10;
    if (damage === 0) return;
    source.damage -= damage;
    if (!TRAINER_TARGET_BLOCKED(store, state, effect, target)) {
      store.reduceEffect(state, new PlaceDamageCountersEffect(player, target, damage));
    }
  });
}
