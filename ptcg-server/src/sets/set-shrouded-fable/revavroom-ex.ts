import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { checkBenchSize } from '../../game/store/effect-reducers/check-effect';
import { MOVE_CARDS, MOVED_TO_ACTIVE_THIS_TURN, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Revavroomex extends PokemonCard implements CopiedAttackOwnershipContract {

  public regulationMark = 'H';

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Varoom';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 280;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Accelerator Flash',
      cost: [CardType.METAL],
      damage: 20,
      damageCalculation: '+',
      text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 120 more damage.'
    },
    {
      name: 'Shattering Speed',
      cost: [CardType.METAL, CardType.METAL, CardType.METAL],
      damage: 250,
      text: 'Discard this Pokémon and all attached cards.'
    },
  ];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '15';

  public name: string = 'Revavroom ex';

  public fullName: string = 'Revavroom ex SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return Revavroomex.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (MOVED_TO_ACTIVE_THIS_TURN(effect.player, this)) {
        effect.damage += 120;
      } else {
        effect.damage = 20;
        return state;
      }
    }

    // The official Shattering Speed ruling promotes the user's replacement before
    // the defender's Knock Out is processed. Discarding the attacker awards no Prizes.
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const { player, source } = effect;
      const attacker = source.getPokemonCard();
      afterAttackDamage(state, effect, (store, afterState) => {
        if (!attacker || source.getPokemonCard() !== attacker) return afterState;
        MOVE_CARDS(store, afterState, source, player.discard, { sourceCard: attacker, sourceEffect: effect });
        if (source !== player.active || source.getPokemonCard()) return afterState;

        const benchSizeHandled = afterState.benchSizeChangeHandled;
        checkBenchSize(store, afterState);
        afterState.benchSizeChangeHandled = benchSizeHandled;
        const promote = () => SWITCH_ACTIVE_WITH_BENCHED(store, afterState, player);
        if (store.hasPrompts()) return store.waitPrompt(afterState, promote);
        return promote();
      });
    }
    return state;
  }
}
