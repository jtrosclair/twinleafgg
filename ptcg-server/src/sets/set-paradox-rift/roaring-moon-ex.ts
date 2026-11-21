import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';

import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { ConfirmPrompt, GameMessage, StateUtils } from '../../game';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { KnockOutOpponentEffect } from '../../game/store/effects/attack-effects';
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class RoaringMoonex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex, CardTag.ANCIENT];

  public stage = Stage.BASIC;

  public cardType = CardType.DARK;

  public hp = 230;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Frenzied Gouging',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: 0,
      text: 'Knock Out your opponent\'s Active Pokémon. If your opponent\'s Active Pokémon is Knocked Out in this way, this Pokémon does 200 damage to itself.'
    },
    {
      name: 'Calamity Storm',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: 100,
      damageCalculation: '+',
      text: 'You may discard a Stadium in play. If you do, this attack does 120 more damage.'
    }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '124';

  public name: string = 'Roaring Moon ex';

  public fullName: string = 'Roaring Moon ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const target = effect.opponent.active;
      if (!target.getPokemonCard()) return state;

      const knockOut = new KnockOutOpponentEffect(effect, 999);
      knockOut.target = target;
      state = store.reduceEffect(state, knockOut);
      if (knockOut.knockedOut) {
        state = THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 200);
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard) {
        state = store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.CALAMITY_STORM,
        ), wantToUse => {
          if (!wantToUse) return state;

          effect.damage += 120;
          afterAttackDamage(state, effect, (attackStore, attackState) => {
            if (StateUtils.getStadiumCard(attackState) !== stadiumCard) return attackState;
            const stadium = StateUtils.findCardList(attackState, stadiumCard);
            const owner = StateUtils.findOwner(attackState, stadium);
            return attackStore.reduceEffect(attackState,
              new MoveCardsEffect(stadium, owner.discard, { sourceCard: this, sourceEffect: effect }));
          });
          return state;
        });
        return state;
      }
      return state;
    }
    return state;
  }
}
