import { CardType, PokemonCard, PowerType, Stage, State, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { registerCoinFlipKnockOutRetaliation } from '../../game/store/prefabs/knock-out-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Weezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Koffing';
  public cardType: CardType = D;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C, C];
  public powers = [{
    name: 'Let\'s Have a Blast',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is Knocked Out by damage from an attack from your ' +
      'opponent\'s Pokémon, flip a coin. If heads, the Attacking Pokémon is Knocked Out.'
  }];
  public attacks = [
    {
      name: 'Spinning Fumes',
      cost: [C, C],
      damage: 50,
      text: 'This attack also does 10 damage to each of your opponent\'s Benched Pokémon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];
  public set: string = 'MEW';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '110';
  public name: string = 'Weezing';
  public fullName: string = 'Weezing MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: game/store/prefabs/knock-out-effects.ts (original attacker and grouped Knock Outs).
    registerCoinFlipKnockOutRetaliation(store, state, effect, this, true);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }
}