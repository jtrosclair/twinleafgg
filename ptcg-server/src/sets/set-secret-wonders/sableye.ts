import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { GameError, GameMessage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { CardList } from '../../game/store/state/card-list';

export class Sableye extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = D;
  public weakness = [];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Rummage',
    cost: [C],
    damage: 0,
    text: 'Look at the top 5 cards of your deck. Choose as many Trainer cards as you like, show them to your opponent, and put them into your hand. Put the other cards back on top of your deck. Shuffle your deck afterward.'
  },
  {
    name: 'Shadow Sneak',
    cost: [D, C],
    damage: 20,
    damageCalculation: '+',
    text: 'If you and your opponent have a different number of Prize cards left, this attack does 20 damage plus 20 more damage.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Sableye';
  public fullName: string = 'Sableye SW';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-secret-wonders/stantler.ts (private choice followed by public reveal).
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (store, next) => {
      const player = effect.player;
      if (!player.deck.cards.length) return next;
      const top = new CardList();
      player.deck.moveTo(top, Math.min(5, player.deck.cards.length));
      const blocked = top.cards.map((card, i) => card.superType === SuperType.TRAINER ? -1 : i).filter(i => i >= 0);
      return store.prompt(next, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_HAND, top, {},
        { min: 0, max: top.cards.length - blocked.length, allowCancel: false, blocked }), selected => {
        if (!selected || new Set(selected).size !== selected.length || selected.some(card => !top.cards.includes(card) || card.superType !== SuperType.TRAINER)) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        const finish = () => {
          if (selected.length) MOVE_CARDS(store, next, top, player.hand, { cards: selected, sourceCard: effect.source.getPokemonCard() || this, sourceEffect: effect });
          player.deck.cards = [...top.cards, ...player.deck.cards];
          top.cards = [];
          SHUFFLE_DECK(store, next, player);
        };
        if (!selected.length) { finish(); return; }
        store.prompt(next, new ShowCardsPrompt(effect.opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), finish);
      });
    });
    // Ref: set-secret-wonders/lickitung.ts (additive attack modifier).
    if (WAS_ATTACK_USED(effect, 1, this) && effect.player.getPrizeLeft() !== effect.opponent.getPrizeLeft()) effect.damage += 20;
    return state;
  }
}
