import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import {
  IS_ABILITY_BLOCKED,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';

export class MegaChandelureex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Lampent';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = P;
  public hp: number = 350;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Cursed Flame',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Active Pokémon\'s Retreat Cost is [C] more.',
  }];

  public attacks = [{
    name: 'Phantom Maze',
    cost: [P, P],
    damage: 130,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.',
  }];

  public set: string = "PBL";
  public setNumber: string = "38";
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Chandelure ex';
  public fullName: string = 'Mega Chandelure ex M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-scarlet-and-violet/spidops-ex.ts (apply one extra Retreat Energy to the opposing Active).
    if (effect instanceof CheckRetreatCostEffect) {
      const { player } = effect;
      const owner = StateUtils.getOpponent(state, player);
      if (player.active.getPokemonCard()
        && StateUtils.isPokemonInPlay(owner, this) && !IS_ABILITY_BLOCKED(store, state, owner, this)
        && CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, this.powers[0], this, player.active)) {
        effect.colorlessAdjustment++;
      }
    }

    // Phantom Maze — Ref: set-brilliant-stars/flygon.ts (Desert Pillar — Colorless in opponent Active Retreat Cost)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkRetreat = new CheckRetreatCostEffect(opponent);
      store.reduceEffect(state, checkRetreat);
      const colorlessCount = checkRetreat.cost.filter(c => c === CardType.COLORLESS).length;

      effect.damage = 130 + 50 * colorlessCount;
    }

    return state;
  }
}
