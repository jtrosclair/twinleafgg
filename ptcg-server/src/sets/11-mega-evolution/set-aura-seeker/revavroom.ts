import { CardType, ChoosePokemonPrompt, EnergyCard, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { afterAttackDamage } from '../../../game/store/prefabs/attack-after-damage';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Revavroom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Varoom';
  public hp: number = 140;
  public cardType: CardType = M;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Suffocating Gas',
    cost: [M],
    damage: 30,
    text: ''
  },
  {
    name: 'Long Drive',
    cost: [M, M, M],
    damage: 100,
    text: 'Discard all Energy from this Pokémon. This attack also does 100 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Revavroom';
  public fullName: string = 'Revavroom FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!WAS_ATTACK_USED(effect, 1, this)) return state;

    const { opponent, player, source } = effect;
    const queueDiscard = () => afterAttackDamage(state, effect, (store, next) => {
      const cards = [...new Set([...source.energies.cards, ...source.cards.filter(card => card instanceof EnergyCard)])];
      if (cards.length === 0) return next;
      const discard = new DiscardCardsEffect(effect, cards);
      discard.target = source;
      return store.reduceEffect(next, discard);
    });

    if (opponent.bench.some(slot => slot.getPokemonCard())) {
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id, GameMessage.CHOOSE_POKEMON_TO_DAMAGE, PlayerType.TOP_PLAYER, [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false },
      ), ([target]) => {
        if (target) {
          const defender = target.getPokemonCard();
          afterAttackDamage(state, effect, (store, next) => {
            if (!defender || target.getPokemonCard() !== defender) return next;
            const damage = new PutDamageEffect(effect, 100);
            damage.target = target;
            return store.reduceEffect(next, damage);
          });
        }
        queueDiscard();
      });
    }
    queueDiscard();
    return state;
  }
}
