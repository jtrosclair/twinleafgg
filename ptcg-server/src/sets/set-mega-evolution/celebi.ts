import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PokemonCard as Pokemon } from '../../game/store/card/pokemon-card';

function* playAttack(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_ATTACK);
  }

  // Count Grass Pokemon and Stadium cards
  let grassPokemons = 0;
  let stadiums = 0;
  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    if (c instanceof Pokemon && c.cardType === CardType.GRASS) {
      grassPokemons += 1;
    } else if (c instanceof TrainerCard && c.trainerType === TrainerType.STADIUM) {
      stadiums += 1;
    } else {
      blocked.push(index);
    }
  });

  const maxPokemons = Math.min(grassPokemons, 3);
  const maxStadiums = Math.min(stadiums, 3);
  const count = Math.min(maxPokemons + maxStadiums, 3);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    {},
    {
      min: 0,
      max: count,
      allowCancel: false,
      blocked,
      maxPokemons,
      maxStadiums,
      allowDifferentSuperTypes: true
    }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Celebi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 80;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Traverse Time',
    cost: [CardType.GRASS],
    damage: 0,
    text: 'Search your deck for up to 3 in any combination of {G} Pokémon and Stadium cards, reveal them, and put them into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Solar Cutter',
    cost: [CardType.GRASS],
    damage: 30,
    text: ''
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Celebi';
  public fullName: string = 'Celebi MEG';
  public regulationMark = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = playAttack(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
