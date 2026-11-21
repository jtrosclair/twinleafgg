import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Ampharos extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Flaaffy';
  public cardType: CardType = L;
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Electromagnetic Wall',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokemon is your Active Pokemon, whenever your opponent attaches an Energy from his or her hand to 1 of his or her Pokemon, put 3 damage counters on that Pokemon.'
  }];

  public attacks = [
    {
      name: 'Electrobullet',
      cost: [L, C, C],
      damage: 70,
      text: 'Does 20 damage to 1 of your opponent\'s Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '40';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ampharos';
  public fullName: string = 'Ampharos DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Electromagnetic Wall - damage when opponent attaches energy from hand
    if (effect instanceof AfterAttachEnergyFromHandEffect) {
      const { player, target } = effect;
      const owner = StateUtils.getOpponent(state, player);
      const recipient = effect.recipientAtAttachment;
      const power = this.powers[0];
      const canResolve = () => !!recipient && target.getPokemonCard() === recipient
        && player.getPokemonInPlay().includes(target) && StateUtils.isPokemonInPlay(owner, this)
        && !IS_ABILITY_BLOCKED(store, state, owner, this);
      if (owner.active.getPokemonCard() === this && canResolve()) effect.reactions.set(`${power.name}:${this.id}`, {
        label: power.name,
        canResolve,
        resolve: () => { store.reduceEffect(state, new PlaceDamageCountersEffect(owner, target, 30, this, power)); },
      });
    }

    // Attack: Electrobullet - 70 to active, 20 to a benched
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
    }

    return state;
  }
}
