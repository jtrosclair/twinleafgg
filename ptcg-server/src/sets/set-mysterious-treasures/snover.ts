import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Snover extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = G;
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Curiosity',
    cost: [],
    damage: 0,
    text: 'Look at your opponent\'s hand.'
  }, {
    name: 'Snowball Fight',
    cost: [W, C],
    damage: 30,
    text: 'Flip a coin. If tails, Snover does 10 damage to itself.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Snover';
  public fullName: string = 'Snover MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      afterAttackDamage(state, effect, (effectStore, resultState) => SHOW_CARDS_TO_PLAYER(effectStore, resultState, player, opponent.hand.cards));
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const source = effect.source, attacker = source.getPokemonCard();
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) return;
        afterAttackDamage(state, effect, (effectStore, resultState) => {
          const inPlay = resultState.players.some(p => p.active === source || p.bench.includes(source));
          if (!attacker || !inPlay || source.getPokemonCard() !== attacker) return resultState;
          const selfAttack = new AttackEffect(effect.player, effect.opponent, effect.attack);
          selfAttack.source = source; selfAttack.ignoreWeakness = true; selfAttack.ignoreResistance = true;
          const damage = new DealDamageEffect(selfAttack, 10); damage.target = source;
          return effectStore.reduceEffect(resultState, damage);
        });
      });
    }

    return state;
  }
}
