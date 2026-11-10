import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SpecialCondition } from '../../game/store/card/card-types';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Chimecho extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = P;
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Call In',
    cost: [C],
    damage: 0,
    text: 'Draw a card. If Chingling is anywhere under Chimecho, draw 2 more cards.'
  },
  {
    name: 'Strange Bell',
    cost: [P],
    damage: 20,
    text: 'If the Defending Pokémon is a Basic Pokémon, that Pokémon is now Confused.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Chimecho';
  public fullName: string = 'Chimecho MT';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/togetic.ts (post-damage draw by the attacker).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const source = effect.source, attacker = source.getPokemonCard();
      const hasChingling = source.getPokemons().some(card => card !== attacker && card.name === 'Chingling');
      afterAttackDamage(state, effect, (_s, next) => { DRAW_CARDS(effect.player, hasChingling ? 3 : 1); return next; });
    }
    // Ref: set-secret-wonders/stantler.ts (condition on original defending Pokémon).
    if (WAS_ATTACK_USED(effect, 1, this)) afterAttackDamageForOriginalDefender(state, effect, (store, next, target) => {
      if (target.getPokemonCard()?.stage !== Stage.BASIC) return next;
      const confused = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]); confused.target = target; return store.reduceEffect(next, confused);
    });
    return state;
  }
}
