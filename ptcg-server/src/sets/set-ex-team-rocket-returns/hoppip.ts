import { CardType, PokemonCard, Stage, PowerType, State, StateUtils, StoreLike, SelectPrompt, SpecialCondition } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GameMessage } from '../../game';
import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Hoppip extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 30;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Buffer',
    powerType: PowerType.POKEBODY,
    text: 'If Hoppip would be Knocked Out by an opponent\'s attack, flip a coin. If heads, Hoppip is not Knocked Out and its remaining HP becomes 10 instead.'
  }];

  public attacks = [{
    name: 'Miracle Powder',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, choose 1 Special Condition. The Defending Pokémon is now affected by that Special Condition.'
  }];

  public set: string = 'TRR';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hoppip';
  public fullName: string = 'Hoppip TRR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return reduceBufferAndMiraclePowder(store, state, effect, this);
  }
}

const conditions = [
  { message: GameMessage.SPECIAL_CONDITION_PARALYZED, value: SpecialCondition.PARALYZED },
  { message: GameMessage.SPECIAL_CONDITION_CONFUSED, value: SpecialCondition.CONFUSED },
  { message: GameMessage.SPECIAL_CONDITION_ASLEEP, value: SpecialCondition.ASLEEP },
  { message: GameMessage.SPECIAL_CONDITION_POISONED, value: SpecialCondition.POISONED },
  { message: GameMessage.SPECIAL_CONDITION_BURNED, value: SpecialCondition.BURNED }
];

// Both prints use the same Poké-Body and secondary attack effect.
export function reduceBufferAndMiraclePowder(store: StoreLike, state: State, effect: Effect, card: PokemonCard): State {
  // Ref: set-burning-shadows/heracross.ts (Guts). The Buffer errata requires opposing attack damage.
  if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === card) {
    const owner = StateUtils.findOwner(state, effect.target);
    if (effect.player !== owner && !IS_POKEBODY_BLOCKED(store, state, owner, card)) {
      effect.surviveOnTenHPCoin = card.powers[0].name;
    }
  }

  if (WAS_ATTACK_USED(effect, 0, card)) {
    afterAttackDamageForOriginalDefender(state, effect, (store, state, target) => {
      const defender = target.getPokemonCard();
      return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
        if (!heads) return;
        store.prompt(state, new SelectPrompt(
          effect.player.id,
          GameMessage.CHOOSE_SPECIAL_CONDITION,
          conditions.map(option => option.message),
          { allowCancel: false }
        ), choice => {
          if (!conditions[choice] || effect.opponent.active !== target || target.getPokemonCard() !== defender) return;
          const condition = new AddSpecialConditionsEffect(effect, [conditions[choice].value]);
          condition.target = target;
          store.reduceEffect(state, condition);
        });
      });
    });
  }

  return state;
}
