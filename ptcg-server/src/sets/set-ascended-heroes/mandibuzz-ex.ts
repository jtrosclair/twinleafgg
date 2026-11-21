import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MandibuzzEx extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.POKEMON_ex];
  public evolvesFrom: string = 'Vullaby';
  public hp: number = 260;
  public cardType: CardType = D;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Bone Shot',
    cost: [C, C],
    damage: 0,
    text: 'This attack does 50 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Vulture Claw',
    cost: [D, C, C],
    damage: 160,
    text: 'Discard a random card from your opponent\'s hand.'
  }];

  public regulationMark = 'J';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '139';
  public name: string = 'Mandibuzz ex';
  public fullName: string = 'Mandibuzz ex ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bone Shot
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(50, effect, store, state);
    }

    // Ref: set-astral-radiance/luxray-v.ts (complete damage before other effects).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const attacker = effect.source.getPokemonCard() ?? this;
      afterAttackDamage(state, effect, (store, state) => {
        const { hand, discard } = effect.opponent;
        if (hand.cards.length === 0) return state;
        const card = hand.cards[Math.floor(Math.random() * hand.cards.length)];
        return MOVE_CARDS(store, state, hand, discard, { cards: [card], sourceCard: attacker, sourceEffect: effect });
      });
    }

    return state;
  }
}
