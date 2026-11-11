import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { CardList, ChooseCardsPrompt, GameMessage, PokemonCardList, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER, DISCARD_ALL_ENERGY_FROM_POKEMON, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Jirachi extends PokemonCard {
  private readonly DOOM_DESIRE_MARKER = 'JIRACHI_DOOM_DESIRE_PENDING_KO';
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = M;
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'One Desire',
    cost: [],
    damage: 0,
    text: 'Search your deck for any 1 card. Shuffle your deck, then put that card on top of your deck.'
  },
  {
    name: 'Doom Desire',
    cost: [M, M],
    damage: 0,
    text: 'Discard all Energy attached to Jirachi. The Defending Pokémon is Knocked Out at the end of your opponent\'s next turn.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Jirachi';
  public fullName: string = 'Jirachi LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // One Desire
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) {
        return state;
      }
      const deckTop = new CardList();
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARDS,
        player.deck,
        {},
        { min: 0, max: 1, allowCancel: true },
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        MOVE_CARDS(store, state, player.deck, deckTop, { cards, sourceCard: this });
        SHUFFLE_DECK(store, state, player);
        store.waitPrompt(state, () => {
          MOVE_CARDS(store, state, deckTop, player.deck, { cards: deckTop.cards, sourceCard: this });
        });
      });
    }

    // Doom Desire
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, effect.player.active.getPokemonCard()!);
      ADD_MARKER(this.DOOM_DESIRE_MARKER, effect.opponent.active, this);
    }

    // Resolve Doom Desire at the end of the defending player's next turn.
    if (effect instanceof EndTurnEffect) {
      const owner = effect.player;
      const targets: PokemonCardList[] = [owner.active, ...owner.bench];
      for (const target of targets) {
        if (HAS_MARKER(this.DOOM_DESIRE_MARKER, target, this)) {
          REMOVE_MARKER(this.DOOM_DESIRE_MARKER, target, this);
          store.reduceEffect(state, new KnockOutEffect(owner, target));
        }
      }
    }

    return state;
  }
}
