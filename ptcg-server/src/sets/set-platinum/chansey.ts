import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Chansey extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp = 90;
  public weakness = [{ type: CardType.FIGHTING, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    { name: "Healing Trial", cost: [CardType.COLORLESS], damage: 0, text: "Flip a coin. If heads, remove 3 damage counters from Chansey. If tails, remove 3 damage counters from the Defending Pokémon." },
    { name: "Pulled Punch", cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 40, text: "If the Defending Pokémon already has any damage counters on it, this attack's base damage is 10 instead of 40." }
  ];
  public set = 'PL';
  public setNumber = "69";
  public cardImage = 'assets/cardback.png';
  public name = "Chansey";
  public fullName = "Chansey PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Chansey.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const source=effect.source,attacker=source.getPokemonCard(),target=effect.opponent.active,defender=target.getPokemonCard();
      afterAttackDamage(state,effect,(s,next)=>COIN_FLIP_PROMPT(s,next,effect.player,heads=>{
        const slot=heads?source:target, card=heads?attacker:defender;
        if(!card || slot.getPokemonCard()!==card) return;
        if(heads ? !next.players.some(p=>p.active===slot||p.bench.includes(slot)) : effect.opponent.active!==slot) return;
        const heal=new HealTargetEffect(effect,30);heal.target=slot;s.reduceEffect(next,heal);
      }));
    }
    if (WAS_ATTACK_USED(effect, 1, this) && effect.opponent.active.damage>0) effect.damage=Math.max(0,effect.damage-30);
    return state;
  }
}
