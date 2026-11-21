import { CardList, CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IronThorns extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.FUTURE];

  public cardType: CardType = L;

  public hp: number = 140;

  public weakness = [{ type: F }];

  public resistance = [];

  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Destructo-Press',
      cost: [L, C],
      damage: 70,
      damageCalculation: 'x',
      text: 'Reveal the top 5 cards of your deck. This attack does 70 damage times for each Future card you find there. Then, discard the revealed Future cards and shuffle the other cards back into your deck.'
    },
    { name: 'Megaton Lariat', cost: [L, L, L, C], damage: 140, text: '' },
  ];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '62';

  public name: string = 'Iron Thorns';

  public fullName: string = 'Iron Thorns TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_ATTACK_USED(effect, 0, this)) return state;
    const { player, opponent } = effect;
    const topCards = new CardList();
    player.deck.moveTo(topCards, Math.min(5, player.deck.cards.length));
    const revealed = topCards.cards.slice();
    const future = revealed.filter(card => card.tags.includes(CardTag.FUTURE));
    const base = future.length * 70;
    effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    if (revealed.length === 0) return state;

    // Ref: set-stellar-crown/lapras-ex.ts (settle the revealed cards after attack damage).
    SHOW_CARDS_TO_PLAYER(store, state, opponent, revealed, player);
    SHOW_CARDS_TO_PLAYER(store, state, player, revealed, player);
    afterAttackDamage(state, effect, (store, afterState) => {
      afterState = MOVE_CARDS(store, afterState, topCards, player.discard, {
        cards: future, sourceCard: effect.source.getPokemonCard(), sourceEffect: effect,
      });
      if (topCards.cards.length > 0) {
        topCards.moveTo(player.deck);
        return SHUFFLE_DECK(store, afterState, player);
      }
      return afterState;
    });
    return state;
  }
}
