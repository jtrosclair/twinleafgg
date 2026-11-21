import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DrawPrizesEffect } from '../../game/store/effects/game-effects';
import { takeBonusPrize } from '../../game/store/prefabs/prize-reactions';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { offerBenchedPrizePokemon } from '../../game/store/prefabs/prefabs';

export class Chansey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C, C];
  public powers = [{
    name: 'Lucky Bonus',
    powerType: PowerType.ABILITY,
    exemptFromAbilityLock: true,
    text: 'If you took this Pokémon as a face-down Prize card during your turn and your Bench isn\'t full, ' +
          'before you put it into your hand, you may put it onto your Bench. If you put this Pokémon onto your ' +
          'Bench in this way, flip a coin. If heads, take 1 more Prize card.'
  }];
  public attacks = [{
    name: 'Gentle Slap',
    cost: [C, C, C],
    damage: 70,
    text: ''
  }];
  public set: string = 'MEW';
  public setNumber: string = '113';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chansey';
  public fullName: string = 'Chansey MEW';

  // Keep the default for existing snapshots. Eligibility follows the physical Prize.
  public abilityUsed = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-celestial-storm/jirachi.ts (place the Prize directly on the Bench).
    if (effect instanceof DrawPrizesEffect) {
      offerBenchedPrizePokemon(store, state, effect, this, () => {
        const coinFlip = new CoinFlipEffect(effect.player, heads => {
          if (heads) takeBonusPrize(store, state, effect);
        });
        coinFlip.skipAttackReflip = true;
        store.reduceEffect(state, coinFlip);
      });
    }
    return state;
  }
}
