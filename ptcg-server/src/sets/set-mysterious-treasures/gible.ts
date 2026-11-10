import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { OPPONENT_SWITCHES_THEIR_ACTIVE_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';

class PushDownSwitchEffect extends EffectOfAttackEffect {
  readonly type = 'PUSH_DOWN_SWITCH_EFFECT';
  constructor(base: AttackEffect, private store: StoreLike, private state: State) { super(base); }
  applyEffect(): void { OPPONENT_SWITCHES_THEIR_ACTIVE_POKEMON(this.store, this.state, this.player); }
}

export class Gible extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = C;
  public weakness = [{ type: C, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Push Down',
    cost: [C],
    damage: 10,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Gible';
  public fullName: string = 'Gible MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-ascended-heroes/mightyena.ts (opponent-chosen switch); Goldeen DP (post-damage timing).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const defender = effect.opponent.active;
      const defendingPokemon = defender.getPokemonCard();
      afterAttackDamage(state, effect, (effectStore, effectState) => {
        if (!defendingPokemon || effect.opponent.active !== defender || defender.getPokemonCard() !== defendingPokemon) return effectState;
        const switchEffect = new PushDownSwitchEffect(effect, effectStore, effectState);
        switchEffect.markerSource = this;
        return effectStore.reduceEffect(effectState, switchEffect);
      });
    }

    return state;
  }
}
