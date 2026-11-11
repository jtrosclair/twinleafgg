import { CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { searchBasicsToBench } from '../../game/store/prefabs/search-basic-to-bench';
import { Makuhita } from '../set-mega-evolution/makuhita';
import { Chikorita } from '../set-mega-evolution/chikorita';
import { Toxel } from '../set-phantasmal-flames/toxel';
import { Charmeleon } from '../set-phantasmal-flames/charmeleon';
import { Fennekin } from '../set-chaos-rising/fennekin';

export class Round31MakuhitaMEP extends Makuhita {
  public set = 'MEP'; public setNumber = '68'; public fullName = 'Makuhita MEP';
}
export class Round31ChikoritaMEP extends Chikorita {
  public set = 'MEP'; public setNumber = '69'; public fullName = 'Chikorita MEP';
  constructor() { super(); (this.attacks[0].cost as CardType[]).splice(0, 1, CardType.GRASS); }
}
export class Round31CharmeleonMEP extends Charmeleon {
  public set = 'MEP'; public setNumber = '79'; public fullName = 'Charmeleon MEP'; public hp = 110;
}
export class Round31ToxelMEP extends Toxel implements CopiedAttackOwnershipContract {
  public set = 'MEP'; public setNumber = '78'; public fullName = 'Toxel MEP';
  constructor() { super(); this.attacks = this.attacks.map((attack, index) => index === 0 ? { ...attack, name: 'Call for Family' } : { ...attack, name: 'Playful Kick' }); }
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round31ToxelMEP.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(_store: StoreLike, state: State, effect: Effect, _index: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (store, next) => searchBasicsToBench(store, next, effect, 2));
    return state;
  }
}
export class Round31FennekinMEP extends Fennekin implements CopiedAttackOwnershipContract {
  public set = 'MEP'; public setNumber = '80'; public fullName = 'Fennekin MEP'; public usSetNumber = 'MEP 80';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Round31FennekinMEP.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(_store: StoreLike, state: State, effect: Effect, _index: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state, effect, (store, next) => searchBasicsToBench(store, next, effect, 2));
    return state;
  }
}
