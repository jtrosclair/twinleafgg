import { PokemonCard, Stage, CardType, PowerType, EnergyType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED_FROM_HAND, LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY } from '../../game/store/prefabs/prefabs';


export class Gloom extends PokemonCard {

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Oddish';

  public cardType = CardType.GRASS;

  public hp = 70;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Semi-Blooming Energy',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may look at the top 3 cards of your deck and attach any number of Basic Energy cards you find there to your Pokémon in any way you like. Shuffle the other cards back into your deck.'
  }];

  public attacks = [{
    name: 'Drool',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public set: string = 'MEW';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '44';

  public name: string = 'Gloom';

  public fullName: string = 'Gloom MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED_FROM_HAND(effect, state, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0 || IS_ABILITY_BLOCKED(store, state, player, this)) return state;

      return CONFIRMATION_PROMPT(store, state, player, accepted => {
        if (accepted) {
          // Ref: set-roaring-skies/togekiss-2.ts (Serene Grace).
          LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY(store, state, player, 3, 3, {
            energyFilter: { energyType: EnergyType.BASIC },
          });
        }
      });
    }
    return state;
  }
}
