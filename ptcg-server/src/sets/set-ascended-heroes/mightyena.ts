import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AFTER_ATTACK, SWITCH_OUT_OPPONENT_ACTIVE_POKEMON } from '../../game/store/prefabs/prefabs';

class KickAwaySwitchEffect extends EffectOfAttackEffect {
  readonly type = 'KICK_AWAY_SWITCH_EFFECT';
  constructor(base: AttackEffect, private store: StoreLike, private state: State) { super(base); }
  applyEffect(): void {
    SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(this.store, this.state, this.player, { allowCancel: false });
  }
}

export class Mightyena extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Poochyena';
  public hp = 120;
  public cardType: CardType = D;
  public weakness = [{ type: G }];
  public retreat = [C, C];
  public attacks = [{
    name: 'Kick Away', cost: [D, C], damage: 50,
    text: 'Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
  }, {
    name: 'Sharp Fang', cost: [D, D, C], damage: 130, text: ''
  }];
  public regulationMark = 'H';
  public set = 'ASC';
  public cardImage = 'assets/cardback.png';
  public setNumber = '129';
  public name = 'Mightyena';
  public fullName = 'Mightyena ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-team-up/zoroark.ts (post-attack opposing switch).
    if (AFTER_ATTACK(effect, 0, this) && effect.opponent.active === effect.originalDefender && effect.originalDefender?.getPokemonCard()) {
      const attack = new AttackEffect(effect.player, effect.opponent, effect.attack);
      const switchEffect = new KickAwaySwitchEffect(attack, store, state);
      switchEffect.markerSource = this;
      return store.reduceEffect(state, switchEffect);
    }
    return state;
  }
}
