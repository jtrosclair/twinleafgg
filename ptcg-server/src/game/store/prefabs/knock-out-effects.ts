import { GameMessage } from '../../game-message';
import { CardTarget, PlayerType, SlotType } from '../actions/play-card-action';
import { Card } from '../card/card';
import { CardType, EnergyType, SuperType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { PokemonCard } from '../card/pokemon-card';
import { TrainerCard } from '../card/trainer-card';
import { CheckProvidedEnergyEffect } from '../effects/check-effects';
import { Effect } from '../effects/effect';
import { KnockOutEffect, PlaceDamageCountersEffect } from '../effects/game-effects';
import { AttachEnergyPrompt } from '../prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../prompts/choose-cards-prompt';
import { StateUtils } from '../state-utils';
import { CardList } from '../state/card-list';
import { getAttackDamagePosition, PokemonCardList } from '../state/pokemon-card-list';
import { Player } from '../state/player';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import {
  IS_ABILITY_BLOCKED, IS_TOOL_BLOCKED, MOVE_CARDS, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE
} from './prefabs';

export function registerKnockOutRescue(store: StoreLike, state: State, effect: KnockOutEffect, source: Card, canRescue = () => true): void {
  effect.rescueSource ??= source;
  const { target, player } = effect;
  effect.beforeDiscard.set(source, {
    label: source.name,
    canResolve: () => !!target.getPokemonCard() && !effect.pokemonGoingToLostZone && canRescue(),
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

export function findKnockOutAttacker(state: State, effect: KnockOutEffect): PokemonCardList | undefined {
  const attacker = effect.target.attackDamageKnockOut?.sourceCard;
  if (!attacker) return;
  const opponent = StateUtils.getOpponent(state, effect.player);
  return opponent.getPokemonInPlay().find(slot => slot.getPokemonCard() === attacker);
}

export function registerKnockOutRetaliation(
  store: StoreLike, state: State, effect: Effect, source: PokemonCard | TrainerCard, damage: number
): void {
  if (!WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) || !effect.resolveBeforeDiscard
    || effect.beforeDiscard.has(source)) return;
  const { player, target } = effect;
  const pokemon = source instanceof PokemonCard ? source : undefined;
  const ability = pokemon?.powers[0];
  if (pokemon) {
    if (target.getPokemonCard() !== pokemon || !wasActiveWhenDamaged(effect)
      || IS_ABILITY_BLOCKED(store, state, player, pokemon)) return;
  } else if (!(source instanceof TrainerCard) || !target.tools.includes(source)
    || IS_TOOL_BLOCKED(store, state, player, source)) return;

  effect.beforeDiscard.set(source, {
    label: ability?.name ?? source.name,
    canResolve: () => !!findKnockOutAttacker(state, effect),
    resolve: () => {
      const attacker = findKnockOutAttacker(state, effect);
      if (attacker) {
        store.reduceEffect(state, new PlaceDamageCountersEffect(player, attacker, damage, pokemon, ability));
      }
    }
  });
}

export function getAttachedBasicEnergy(target: PokemonCardList): EnergyCard[] {
  return [...new Set([...target.cards, ...target.energies.cards])]
    .filter((card): card is EnergyCard => card.superType === SuperType.ENERGY && card.energyType === EnergyType.BASIC);
}

export function getAttachedEnergyOfType(
  store: StoreLike, state: State, player: Player, source: PokemonCardList, type: CardType
): Card[] {
  const query = new CheckProvidedEnergyEffect(player, source);
  store.reduceEffect(state, query);
  const providers = new Set(query.energyMap
    .filter(({ provides }) => provides.includes(type) || provides.includes(CardType.ANY))
    .map(({ card }) => card));
  return [...new Set([...source.cards, ...source.energies.cards])].filter(card => providers.has(card));
}

export function registerKnockOutEnergyTransfer(
  store: StoreLike, state: State, effect: KnockOutEffect, card: TrainerCard | PokemonCard,
  options: {
    max: number;
    optional?: boolean;
    sameTarget?: boolean;
    recipient?: PokemonCardList;
    includeActive?: boolean;
    getEnergy?: () => Card[];
  }
): void {
  const { player, target: source } = effect;
  const { recipient } = options;
  const slots = recipient || options.includeActive ? [SlotType.ACTIVE, SlotType.BENCH] : [SlotType.BENCH];
  const getEnergy = options.getEnergy ?? (() => getAttachedBasicEnergy(source));
  const getTargets = () => {
    const allowed: CardTarget[] = [];
    const blockedTo: CardTarget[] = [];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemon, _card, target) => {
      if (!slots.includes(target.slot)) return;
      if (pokemon === source || effect.simultaneousKnockOuts?.has(pokemon)
        || (recipient && (pokemon !== recipient
          || (card instanceof TrainerCard ? !pokemon.tools.includes(card) : pokemon.getPokemonCard() !== card)))) {
        blockedTo.push(target);
      } else {
        allowed.push(target);
      }
    });
    return { allowed, blockedTo };
  };
  const canResolve = () => getEnergy().length > 0 && getTargets().allowed.length > 0;
  const recipientTarget = recipient ? getTargets().allowed[0] : undefined;
  const recipientLabel = recipientTarget?.slot === SlotType.BENCH
    ? ` (${recipient?.getPokemonCard()?.name}, ${recipientTarget.index + 1})`
    : recipientTarget ? ` (${recipient?.getPokemonCard()?.name})` : '';

  const name = card instanceof PokemonCard ? card.powers[0].name : card.name;
  effect.beforeDiscard.set(card, {
    label: name + recipientLabel,
    canResolve,
    resolve: () => {
      const energy = new CardList();
      energy.cards = getEnergy();
      const max = Math.min(energy.cards.length, options.max);
      const move = (cards: Card[], destination: PokemonCardList) =>
        MOVE_CARDS(store, state, source, destination, { cards, sourceCard: card, sourceEffect: effect });

      if (recipient && card instanceof PokemonCard) {
        store.prompt(state, new ChooseCardsPrompt(player, GameMessage.ATTACH_ENERGY_CARDS, energy, {},
          { allowCancel: true, min: 0, max }), selected => {
          if (selected?.length) move(selected, recipient);
        });
        return;
      }

      const { blockedTo } = getTargets();
      store.prompt(state, new AttachEnergyPrompt(
        player.id,
        recipient ? GameMessage.ATTACH_ENERGY_CARDS : GameMessage.ATTACH_ENERGY_TO_BENCH,
        energy,
        PlayerType.BOTTOM_PLAYER,
        slots,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: options.optional ?? false, min: options.optional ? 0 : 1,
          max, sameTarget: options.sameTarget ?? false, blockedTo }
      ), transfers => {
        for (const transfer of transfers ?? []) {
          move([transfer.card], StateUtils.getTarget(state, player, transfer.to));
        }
      });
    }
  });
}
