import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAbilityEffect, PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { DRAW_CARDS, IS_ABILITY_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class HopsPincurchinEx extends PokemonCard {
  public stage = Stage.BASIC;
  public tags = [CardTag.HOPS, CardTag.POKEMON_ex];
  public hp = 200;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C, C];
  public powers = [{
    name: 'Counterattack Quills',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), place 3 damage counters on the Attacking Pokémon.'
  }];
  public attacks = [{ name: 'Spiky Thunder', cost: [L, L, C], damage: 120, text: 'Draw 2 cards.' }];
  public regulationMark = 'I';
  public set = 'ASC';
  public cardImage = 'assets/cardback.png';
  public setNumber = '68';
  public name = 'Hop\'s Pincurchin ex';
  public fullName = 'Hop\'s Pincurchin ex ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-flashfire/qwilfish.ts (Counterattack Quills),
    // set-30th-celebration/wishiwashi.ts (Ability effect targeting).
    if (!effect.preventDefault && ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })
      && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (!IS_ABILITY_BLOCKED(store, state, owner, this)) {
        const ability = new EffectOfAbilityEffect(owner, this.powers[0], this, effect.source);
        state = store.reduceEffect(state, ability);
        if (!ability.preventDefault && ability.target) {
          state = store.reduceEffect(state, new PlaceDamageCountersEffect(owner, ability.target, 30, this));
        }
      }
    }
    // Ref: set-brilliant-stars/drampa-v.ts (Spike Draw).
    if (WAS_ATTACK_USED(effect, 0, this)) DRAW_CARDS(effect.player, 2);
    return state;
  }
}
