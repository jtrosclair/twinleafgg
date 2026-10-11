import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Mewtwoex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public hp: number = 230;
  public cardType: CardType = CardType.PSYCHIC;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Photon Bullets',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC],
    damage: 0,
    text: "This attack does 50 damage to each of your opponent's Pokémon ex. (Don't apply Weakness and Resistance for Benched Pokémon.)",
  },
  {
    name: 'Psychic Powers',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC],
    damage: 230,
    text: "During your next turn, this Pokémon can't use attacks.",
  }];

  public regulationMark: string = 'J';
  public set: string = 'M6a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Mewtwo ex';
  public fullName: string = 'Mewtwo ex 30C';
  public usSetNumber = '30C 64';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Photon Bullets
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const activeCard = opponent.active.getPokemonCard();
      if (activeCard?.tags.includes(CardTag.POKEMON_ex)) {
        const dealDamage = new DealDamageEffect(effect, 50);
        dealDamage.target = opponent.active;
        store.reduceEffect(state, dealDamage);
      }
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList === opponent.active) {
          return;
        }
        const pokemonCard = cardList.getPokemonCard();
        if (pokemonCard?.tags.includes(CardTag.POKEMON_ex)) {
          const putDamage = new PutDamageEffect(effect, 50);
          putDamage.target = cardList;
          store.reduceEffect(state, putDamage);
        }
      });
    }

    // Psychic Powers
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.player.active.cannotAttackNextTurnPending = true;
    }
    return state;
  }
}
