import { PokemonCard } from '../../game/store/card/pokemon-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AfterEvolveEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DISCARD_TOP_X_CARDS_FROM_YOUR_DECK, IS_TOOL_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MCharizardEX extends PokemonCard {

  public stage: Stage = Stage.MEGA;

  public tags = [CardTag.POKEMON_EX, CardTag.MEGA];

  public evolvesFrom = 'Charizard-EX';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 230;

  public weakness = [{ type: CardType.FAIRY }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Wild Blaze',
      cost: [CardType.FIRE, CardType.FIRE, CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: 300,
      text: 'Discard the top 5 cards of your deck.'
    }
  ];

  public set: string = 'FLF';

  public name: string = 'M Charizard-EX';

  public fullName: string = 'M Charizard EX FLF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '69';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterEvolveEffect && effect.pokemonCard === this
      && state.players[state.activePlayer] === effect.player) {
      const spiritLink = effect.target.tools.find((card): card is TrainerCard =>
        card instanceof TrainerCard && card.name === 'Charizard Spirit Link');
      if (spiritLink && !IS_TOOL_BLOCKED(store, state, effect.player, spiritLink)) return state;
      return store.reduceEffect(state, new EndTurnEffect(effect.player));
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, effect.player, 5, this, effect);
    }
    return state;
  }

}
