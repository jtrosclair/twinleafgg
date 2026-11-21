import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GolisopodBatch172 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Wimpod';
  public hp: number = 140;
  public cardType: CardType = W;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Critical Slash',
    cost: [W],
    damage: 30,
    text: 'If your opponent\'s Pokémon is Knocked Out by damage from this attack, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.',
  },
  {
    name: 'Boundless Power',
    cost: [C, C, C],
    damage: 150,
    text: 'During your next turn, this Pokémon can\'t use attacks.',
  }];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Golisopod';
  public fullName: string = "Golisopod M4 26";

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-chaos-rising/golisopod.ts (protection and attack lock).
    if (WAS_ATTACK_USED(effect, 0, this)) effect.protectAttackerOnDamageKnockOut = true;
    if (WAS_ATTACK_USED(effect, 1, this)) effect.source.cannotAttackNextTurnPending = true;
    return state;
  }
}
