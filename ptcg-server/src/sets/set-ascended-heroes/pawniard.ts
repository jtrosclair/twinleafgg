import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AFTER_ATTACK, SWITCH_OUT_OPPONENT_ACTIVE_POKEMON } from '../../game/store/prefabs/prefabs';

class PushDownSwitchEffect extends EffectOfAttackEffect {
  readonly type = 'PUSH_DOWN_SWITCH_EFFECT';
  constructor(base: AttackEffect, private store: StoreLike, private state: State) { super(base); }
  applyEffect(): void {
    SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(this.store, this.state, this.player, { allowCancel: false });
  }
}

export class Pawniard extends PokemonCard {
  public stage = Stage.BASIC;
  public hp = 70;
  public cardType: CardType = M;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];
  public attacks = [{ name: 'Push Down', cost: [M], damage: 10,
    text: 'Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)' }];
  public regulationMark = 'I';
  public set = 'ASC'; public setNumber = '146'; public cardImage = 'assets/cardback.png';
  public name = 'Pawniard'; public fullName = 'Pawniard ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-ascended-heroes/mightyena.ts (opponent switches after damage).
    if (AFTER_ATTACK(effect, 0, this) && effect.opponent.active === effect.originalDefender && effect.originalDefender?.getPokemonCard()) {
      const attack = new AttackEffect(effect.player, effect.opponent, effect.attack);
      const switchEffect = new PushDownSwitchEffect(attack, store, state);
      switchEffect.markerSource = this;
      return store.reduceEffect(state, switchEffect);
    }
    return state;
  }
}
