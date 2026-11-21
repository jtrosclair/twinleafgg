import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED_FROM_HAND, MULTIPLE_COIN_FLIPS_PROMPT, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Porygon2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Porygon';
  public cardType: CardType = C;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Mapping',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Porygon2 from your hand to evolve 1 of your Pokémon, you may search your deck for a Stadium card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  }];

  public attacks = [{
    name: '3-D Attack',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'TM';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Porygon2';
  public fullName: string = 'Porygon2 TM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED_FROM_HAND(effect, state, this)
      && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) return state;

      return CONFIRMATION_PROMPT(store, state, player, accepted => {
        if (accepted) {
          const stadium: Partial<TrainerCard> = { superType: SuperType.TRAINER, trainerType: TrainerType.STADIUM };
          SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this,
            stadium, { min: 0, max: 1, allowCancel: false }, this.powers[0]);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });
        effect.damage = 20 * heads;
      });
    }

    return state;
  }

}
