import { GameMessage } from '../../game-message';
import { CardTarget, PlayerType, SlotType } from '../actions/play-card-action';
import { Card } from '../card/card';
import { EnergyType, SuperType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { TrainerCard } from '../card/trainer-card';
import { KnockOutEffect } from '../effects/game-effects';
import { AttachEnergyPrompt } from '../prompts/attach-energy-prompt';
import { StateUtils } from '../state-utils';
import { CardList } from '../state/card-list';
import { getAttackDamagePosition, PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { MOVE_CARDS } from './prefabs';

export function registerKnockOutRescue(store: StoreLike, state: State, effect: KnockOutEffect, source: Card): void {
  if (effect.rescueSource) return;
  effect.rescueSource = source;
  const { target, player } = effect;
  effect.beforeDiscard.set(source, {
    label: source.name,
    canResolve: () => !!target.getPokemonCard() && !effect.pokemonGoingToLostZone,
    resolve: () => {
      const card = target.getPokemonCard();
      if (!card) return;
      const stack = target.getPokemons();
      const attached = new Set([...target.cards, ...target.tools, ...target.energies.cards]);
      // Return the evolution stack now. Keep the attachments available to
      // other Knock Out effects until the final destination is applied.
      effect.rescuedPokemon = { card, attachments: [] };
      MOVE_CARDS(store, state, target, player.hand, { cards: stack, sourceCard: source, sourceEffect: effect });
      if (!player.hand.cards.includes(card)) {
        effect.rescuedPokemon = undefined;
        return;
      }
      const nested = stack.flatMap(pokemon => pokemon.cards?.cards.splice(0) ?? []);
      effect.rescuedPokemon.attachments = [...new Set(nested)].filter(attachment => !attached.has(attachment));
    }
  });
}

export function wasActiveWhenDamaged(effect: KnockOutEffect): boolean {
  return getAttackDamagePosition(effect.target)?.active ?? effect.target === effect.player.active;
}

export function getAttachedBasicEnergy(target: PokemonCardList): EnergyCard[] {
  return [...new Set([...target.cards, ...target.energies.cards])]
    .filter((card): card is EnergyCard => card.superType === SuperType.ENERGY && card.energyType === EnergyType.BASIC);
}

export function registerKnockOutEnergyTransfer(
  store: StoreLike, state: State, effect: KnockOutEffect, tool: TrainerCard,
  options: { max: number; optional?: boolean; sameTarget?: boolean; recipient?: PokemonCardList }
): void {
  const { player, target: source } = effect;
  const { recipient } = options;
  const slots = recipient ? [SlotType.ACTIVE, SlotType.BENCH] : [SlotType.BENCH];
  const getTargets = () => {
    const allowed: CardTarget[] = [];
    const blockedTo: CardTarget[] = [];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemon, _card, target) => {
      if (!slots.includes(target.slot)) return;
      if (pokemon === source || effect.simultaneousKnockOuts?.has(pokemon)
        || (recipient && (pokemon !== recipient || !pokemon.tools.includes(tool)))) {
        blockedTo.push(target);
      } else {
        allowed.push(target);
      }
    });
    return { allowed, blockedTo };
  };
  const canResolve = () => getAttachedBasicEnergy(source).length > 0 && getTargets().allowed.length > 0;
  const recipientTarget = recipient ? getTargets().allowed[0] : undefined;
  const recipientLabel = recipientTarget?.slot === SlotType.BENCH
    ? ` (${recipient?.getPokemonCard()?.name}, ${recipientTarget.index + 1})`
    : recipientTarget ? ` (${recipient?.getPokemonCard()?.name})` : '';

  effect.beforeDiscard.set(tool, {
    label: tool.name + recipientLabel,
    canResolve,
    resolve: () => {
      const energy = new CardList();
      energy.cards = getAttachedBasicEnergy(source);
      const { blockedTo } = getTargets();
      store.prompt(state, new AttachEnergyPrompt(
        player.id,
        recipient ? GameMessage.ATTACH_ENERGY_CARDS : GameMessage.ATTACH_ENERGY_TO_BENCH,
        energy,
        PlayerType.BOTTOM_PLAYER,
        slots,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: options.optional ?? false, min: options.optional ? 0 : 1,
          max: Math.min(energy.cards.length, options.max), sameTarget: options.sameTarget ?? false, blockedTo }
      ), transfers => {
        for (const { to, card } of transfers ?? []) {
          MOVE_CARDS(store, state, source, StateUtils.getTarget(state, player, to),
            { cards: [card], sourceCard: tool, sourceEffect: effect });
        }
      });
    }
  });
}
