import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../game/store/prefabs/attack-effects';
import { DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON } from '../../game/store/prefabs/costs';
import { COIN_FLIP_PROMPT, DISCARD_TOP_X_OF_OPPONENTS_DECK, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';

import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';

export class Entei extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = R;
  public weakness = [{ type: W, value: +20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Burning Coat',
    powerType: PowerType.POKEBODY,
    text: 'Whenever 1 of your opponent\'s Pokémon is Knocked Out by damage from Entei\'s attacks, discard the top 3 cards from your opponent\'s deck.'
  }];

  public attacks = [{
    name: 'Blaze Roar',
    cost: [R, R, R],
    damage: 60,
    text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Flip a coin. If tails, discard 2 Energy cards attached to Entei.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Entei';
  public fullName: string = 'Entei SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-ascended-heroes/hops-trevenant.ts (confirmed opposing attack damage).
    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect)
      && effect.resolveBeforeDiscard && effect.target.attackDamageKnockOut?.sourceCard === this) {
      const player = state.players[state.activePlayer];
      if (StateUtils.isPokemonInPlay(player, this) && !IS_POKEBODY_BLOCKED(store, state, player, this)) {
        effect.beforeDiscard.set(this, {
          label: this.powers[0].name,
          canResolve: () => effect.player.deck.cards.length > 0,
          resolve: () => { DISCARD_TOP_X_OF_OPPONENTS_DECK(store, state, player, 3, this, this.powers[0]); }
        });
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      // Ref: set-crimson-invasion/staraptor.ts (effects after the Active takes damage).
      afterAttackDamage(state, effect, (store, state) =>
        THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state));
      afterAttackDamage(state, effect, (store, state) =>
        COIN_FLIP_PROMPT(store, state, effect.player, heads => {
          if (!heads && effect.player.active === effect.source) {
            DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON(store, state, effect, 2, {}, 2, [SlotType.ACTIVE]);
          }
        }));
    }

    return state;
  }
}
