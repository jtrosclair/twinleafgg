import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameError, GameMessage, PlayerType, SlotType, StateUtils, PutDamagePrompt, DamageMap } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect, SelfKnockOutEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Cofagrigus extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Yamask';
  public cardType: CardType = P;
  public tags: string[] = [CardTag.TEAM_PLASMA];
  public hp: number = 100;
  public weakness = [{ type: D }];
  public retreat = [C, C];

  public powers = [{
    name: 'Six Feet Under',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    knocksOutSelf: true,
    text: 'Once during your turn (before your attack) you may Knock Out this Pokémon. If you do, put 3 damage counters on your opponent\'s Pokémon in any way you like.'
  }];

  public attacks = [
    {
      name: 'Slap of Misfortune',
      cost: [P, P, C],
      damage: 70,
      text: 'NOT CURRENTLY WORKING: Whenever your opponent flips a coin during his or her next turn, treat it as tails.'
    }
  ];

  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Cofagrigus';
  public fullName: string = 'Cofagrigus PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-shrouded-fable/dusclops.ts (Cursed Blast).
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);

      const opponent = StateUtils.getOpponent(state, player);
      const damage = 30;
      return store.prompt(state, new PutDamagePrompt(
        player.id, GameMessage.CHOOSE_POKEMON_TO_DAMAGE, PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH], damage, [], { allowCancel: false },
      ), (results: DamageMap[] | null) => {
        if (!results || results.reduce((total, result) => total + result.damage, 0) !== damage
          || results.some(result => result.damage < 0 || result.damage % 10 !== 0)) {
          throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        const targets = results.filter(result => result.damage > 0)
          .map(({ target, damage }) => ({ target: StateUtils.getTarget(state, player, target), damage }));
        const inPlay = opponent.getPokemonInPlay();
        if (targets.some(({ target }) => !inPlay.includes(target))
          || new Set(targets.map(({ target }) => target)).size !== targets.length) {
          throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        for (const { target, damage } of targets) {
          store.reduceEffect(state, new PlaceDamageCountersEffect(player, target, damage, this));
        }
        store.reduceEffect(state, new SelfKnockOutEffect(player, this));
      });
    }
    return state;
  }
}
