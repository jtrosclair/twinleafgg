import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils, PowerType } from '../../game';
import { ApplyWeaknessEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { REDUCE_ATTACK_DAMAGE_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';

export class Garbodor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Trubbish';
  public hp: number = 140;
  public cardType: CardType = D;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Gloomy Garbage',
    powerType: PowerType.ABILITY,
    text: "Attacks used by your opponent's Active Pokémon that has a Pokémon Tool attached do 20 less damage (before applying Weakness and Resistance).",
  }];
  public attacks = [{
    name: 'Sludge Bomb',
    cost: [D, D, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public usSetNumber = 'CRI 57';
  public name: string = 'Garbodor';
  public fullName: string = 'Garbodor M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-obsidian-flames/entei.ts (attacker-side reduction).
    if ((effect instanceof ApplyWeaknessEffect || effect instanceof PutDamageEffect) && effect.source.tools.length > 0) {
      const owner = StateUtils.getOpponent(state, effect.player);
      if (StateUtils.isPokemonInPlay(owner, this)) {
        REDUCE_ATTACK_DAMAGE_FROM_ABILITY(store, state, effect, owner, this, 20);
      }
    }
    return state;
  }
}
