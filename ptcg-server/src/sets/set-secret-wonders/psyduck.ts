import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { COIN_FLIP_PROMPT, DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';

export class Psyduck extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = W;
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Delusion',
    cost: [C],
    damage: 0,
    text: 'If Psyduck is Confused, draw 2 cards.'
  },
  {
    name: 'Migraine',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused. If tails, Psyduck is now Confused.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Psyduck';
  public fullName: string = 'Psyduck SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/togetic.ts (post-damage draw).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const source = effect.source, attacker = source.getPokemonCard();
      afterAttackDamage(state, effect, (_postStore, nextState) => {
        if (attacker && source.getPokemonCard() === attacker && source.specialConditions.includes(SpecialCondition.CONFUSED)) DRAW_CARDS(effect.player, 2);
        return nextState;
      });
    }
    // Ref: set-great-encounters/ge-attack-effects.ts (coin after damage, original card identities).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const source = effect.source, attacker = source.getPokemonCard(), defender = effect.opponent.active, defenderCard = defender.getPokemonCard();
      afterAttackDamage(state, effect, (postStore, nextState) => COIN_FLIP_PROMPT(postStore, nextState, effect.player, heads => {
        const target = heads ? defender : source, card = heads ? defenderCard : attacker;
        const inPlay = nextState.players.some(p => p.active === target || p.bench.includes(target));
        if (!card || !inPlay || target.getPokemonCard() !== card || (heads && effect.opponent.active !== defender)) return;
        const confused = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]); confused.target = target; postStore.reduceEffect(nextState, confused);
      }));
    }
    return state;
  }
}
