import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { CoinFlipPrompt, GameMessage, PlayerType, StateUtils } from '../../game';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { StoreLike, State } from '../../game';
import { preventDamageEffect } from '../../game/store/effects/effect-of-attack-effects';

export class Wailord extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Wailmer';
  public cardType: CardType = CardType.WATER;
  public hp: number = 200;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Dive',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 40,
      text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
    },
    {
      name: 'Open Sea',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 80,
      text: 'Heal 30 damage from each of your Water Pokémon.'
    }
  ];

  public set: string = 'GRI';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wailord';
  public fullName: string = 'Wailord GRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dive attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result) {
          const preventEffect = preventDamageEffect(effect, this);
          store.reduceEffect(state, preventEffect);
        }
        return state;
      });
    }

    // Open Sea attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        // Only heal Water Pokémon
        if (card && card.cardType === CardType.WATER) {
          const healEffect = new HealEffect(player, cardList, 30);
          store.reduceEffect(state, healEffect);
        }
      });

      return state;
    }

    return state;
  }
}