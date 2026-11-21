import { CardType, PokemonCard, ShuffleDeckPrompt, Stage, State, StoreLike } from '../../game';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';

export class Mantine extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Make Waves',
    cost: [C],
    damage: 0,
    text: 'Each player shuffles their hand into their deck and draws 4 cards..'
  },
  {
    name: 'Bubble Drain',
    cost: [W, C],
    damage: 30,
    text: 'Heal 30 damage from this Pokémon.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'DLR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Mantine';
  public fullName: string = 'Mantine M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const { player, opponent } = effect;
      for (const owner of [player, opponent]) {
        if (owner.hand.cards.length > 0) {
          state = MOVE_CARDS(store, state, owner.hand, owner.deck, { sourceCard: this, sourceEffect: effect });
        }
      }
      return store.prompt(state, new ShuffleDeckPrompt(player.id), playerOrder => {
        player.deck.applyOrder(playerOrder);
        store.prompt(state, new ShuffleDeckPrompt(opponent.id), opponentOrder => {
          opponent.deck.applyOrder(opponentOrder);
          DRAW_CARDS(player, 4);
          DRAW_CARDS(opponent, 4);
        });
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      afterAttackDamage(state, effect, (store, next) => {
        const healing = new HealTargetEffect(effect, 30);
        healing.target = effect.source;
        return store.reduceEffect(next, healing);
      });
    }
    return state;
  }
}
