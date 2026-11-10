import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { RECOVER_DISCARD_BY_ATTACK } from '../../game/store/prefabs/recover-discard-attack';
import { SuperType, EnergyType } from '../../game/store/card/card-types';

export class Misdreavus extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp = 50;
  public weakness = [{ type: CardType.DARK, value: 10 }];
  public resistance = [{ type: CardType.COLORLESS, value: -20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Take Back", cost: [], damage: 0, text: "Flip a coin. If heads, search your discard pile for a Trainer card, show it to your opponent, and put it into your hand." },
    { name: "Tackle", cost: [CardType.COLORLESS], damage: 10, text: "" }
  ];
  public set = 'PL';
  public setNumber = "83";
  public cardImage = 'assets/cardback.png';
  public name = "Misdreavus";
  public fullName = "Misdreavus PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Misdreavus.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) afterAttackDamage(state,effect,(s,next)=>COIN_FLIP_PROMPT(s,next,effect.player,heads=>{if(heads)RECOVER_DISCARD_BY_ATTACK(s,next,effect,c=>c.superType===SuperType.TRAINER,1,false);}));
    return state;
  }
}
