import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import {
  PlayerType, SlotType, CardTarget, GameError, GameMessage,
  PokemonCardList, Player, ChooseEnergyPrompt, Card
} from '../../game';
import { HealEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect, self: SuperPotion): IterableIterator<State> {
  const player = effect.player;

  const blocked: CardTarget[] = [];
  let hasPokemonWithDamage: boolean = false;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    const energyCount = new CheckProvidedEnergyEffect(player, cardList);
    store.reduceEffect(state, energyCount);

    if (cardList.damage === 0 || energyCount.energyMap.length < 1) {
      blocked.push(target);
    } else {
      hasPokemonWithDamage = true;
    }
  });

  if (hasPokemonWithDamage === false) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  effect.preventDefault = true;

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_HEAL,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { min: 1, max: 1, allowCancel: false, blocked }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length === 0) {
    return state;
  }

  const target = targets[0];

  const healEffect = new HealEffect(player, target, 60);
  store.reduceEffect(state, healEffect);

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, target);
  state = store.reduceEffect(state, checkProvidedEnergy);

  state = store.prompt(state, new ChooseEnergyPrompt(
    player.id,
    GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
    checkProvidedEnergy.energyMap,
    [CardType.COLORLESS],
    { allowCancel: false }
  ), energy => {
    const cards: Card[] = (energy || []).map(e => e.card);
    MOVE_CARDS(store, state, target, player.discard, { cards: cards, sourceCard: self });
  });

  return state;
}

export class SuperPotion extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'I';
  public set: string = 'JTG';
  public setNumber: string = '158';
  public name: string = 'Super Potion';
  public fullName: string = 'Super Potion JTG';

  public text: string =
    'Heal 60 damage from 1 of your Pokémon. If you healed any damage in this way, discard an Energy from that Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    let hasPokemonWithDamage: boolean = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      const energyCount = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, energyCount);

      if (energyCount.energyMap.length >= 1 && cardList.damage !== 0) {
        hasPokemonWithDamage = true;
      }
    });
    return hasPokemonWithDamage;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }
    return state;
  }
}
