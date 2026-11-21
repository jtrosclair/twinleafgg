import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect, SelfKnockOutEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Dusclops extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Duskull';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Cursed Blast',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    knocksOutSelf: true,
    text: 'Once during your turn, you may put 5 damage counters on 1 of your opponent\'s Pokémon. If you use this Ability, this Pokémon is Knocked Out.'
  }];

  public attacks = [
    {
      name: 'Will-o-Wisp',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '19';

  public name: string = 'Dusclops';

  public fullName: string = 'Dusclops SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_ABILITY);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const target = selected?.[0];
        if (!target) return;
        state = store.reduceEffect(state, new PlaceDamageCountersEffect(player, target, 50, this));
        store.reduceEffect(state, new SelfKnockOutEffect(player, this));
      });
    }
    return state;
  }

  /** Its printed attack has no additional effects; its Ability is not copied. */
  public reduceCopiedAttackEffect(_store: StoreLike, state: State, _effect: Effect, _attackIndex: number): State {
    return state;
  }

}