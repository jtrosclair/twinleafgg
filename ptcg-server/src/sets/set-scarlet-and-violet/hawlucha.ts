import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import {
  PowerType, StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType,
  StateUtils
} from '../../game';
import { Stage, CardType } from '../../game/store/card/card-types';
import { AfterPlayBasicFromHandEffect } from '../../game/store/effects/play-card-effects';
import { GameMessage } from '../../game/game-message';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { queueBenchPlayAbility } from '../../game/store/prefabs/bench-play-reactions';
import { ABILITY_USED, CONFIRMATION_PROMPT } from '../../game/store/prefabs/prefabs';

export class Hawlucha extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Flying Entry',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your ' +
      'Bench during your turn, you may choose 2 of your ' +
      'opponent\'s Benched Pokémon and put 1 damage counter ' +
      'on each of them.'
  }];

  public attacks = [
    {
      name: 'Wing Attack',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '118';

  public name: string = 'Hawlucha';

  public fullName: string = 'Hawlucha SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-perfect-order/meowth-ex.ts (completed hand-to-Bench reaction).
    if (effect instanceof AfterPlayBasicFromHandEffect && effect.pokemonCard === this) {
      const { player } = effect;
      const opponent = StateUtils.getOpponent(state, player);
      queueBenchPlayAbility(store, state, effect, () => {
        CONFIRMATION_PROMPT(store, state, player, accepted => {
          if (!accepted) return;

          const count = Math.min(2, opponent.bench.filter(slot => slot.getPokemonCard()).length);
          if (!count) return;
          store.prompt(state, new ChoosePokemonPrompt(
            player.id, GameMessage.CHOOSE_POKEMON_TO_DAMAGE, PlayerType.TOP_PLAYER, [SlotType.BENCH],
            { min: count, max: count, allowCancel: false },
          ), targets => {
            ABILITY_USED(player, this);
            for (const target of targets) {
              state = store.reduceEffect(state, new PlaceDamageCountersEffect(player, target, 10, this, this.powers[0]));
            }
          });
        });
      }, () => opponent.bench.some(slot => slot.getPokemonCard()));
    }
    return state;
  }

  /** Its printed attack has no additional effects; its Ability is not copied. */
  public reduceCopiedAttackEffect(_store: StoreLike, state: State, _effect: Effect, _attackIndex: number): State {
    return state;
  }

}
