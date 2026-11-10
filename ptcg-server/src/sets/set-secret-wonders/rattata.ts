import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';

export class Rattata extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 30;
  public cardType: CardType = C;
  public weakness = [{ type: F, value: 10 }];
  public retreat = [];

  public attacks = [{
    name: 'Tail Whip',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon can\'t attack during your opponent\'s next turn.'
  },
{
    name: 'Bite',
    cost: [C],
    damage: 20,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '103';
  public name: string = 'Rattata';
  public fullName: string = 'Rattata SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-diamond-and-pearl/staravia.ts (post-damage, target-owned next-turn lock).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const target = effect.opponent.active, defender = target.getPokemonCard();
      afterAttackDamage(state, effect, (postStore, nextState) => COIN_FLIP_PROMPT(postStore, nextState, effect.player, heads => {
        if (!heads || !defender || effect.opponent.active !== target || target.getPokemonCard() !== defender) return;
        postStore.reduceEffect(nextState, new RattataAttackLock(effect, target));
      }));
    }
    return state;
  }
}

// Defending Pokémon cannot attack through the end of its own next turn.
class RattataAttackLock extends EffectOfAttackEffect {
  readonly type = 'RATTATA_ATTACK_LOCK';
  constructor(base: AttackEffect, target: PokemonCardList) { super(base); this.target = target; }
  applyEffect(): void { this.target.cannotAttackNextTurn = true; }
}
