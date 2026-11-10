import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';

class ElegantSwimProtection extends EffectOfAttackEffect {
  readonly type = 'ELEGANT_SWIM_PROTECTION';
  constructor(base: AttackEffect) { super(base); this.target = base.source; }
  applyEffect(): void {
    this.target.preventDamageNextTurnPending = true;
    this.target.preventEffectsOfAttacksNextTurnPending = true;
  }
}

export class Finneon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = W;
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Elegant Swim',
    cost: [W],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Finneon during your opponent\'s next turn.'
  },
{
    name: 'Tackle',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name: string = 'Finneon';
  public fullName: string = 'Finneon MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: game/store/prefabs/effect-of-attack-prefabs.ts (self-protection).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const source = effect.source, attacker = source.getPokemonCard();
      return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
        if (!heads) return;
        afterAttackDamage(state, effect, (effectStore, resultState) => {
          const inPlay = resultState.players.some(p => p.active === source || p.bench.includes(source));
          if (!attacker || !inPlay || source.getPokemonCard() !== attacker) return resultState;
          const protection = new ElegantSwimProtection(effect);
          protection.markerSource = this;
          return effectStore.reduceEffect(resultState, protection);
        });
      });
    }

    return state;
  }
}
