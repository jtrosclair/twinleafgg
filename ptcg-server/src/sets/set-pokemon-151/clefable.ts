import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { GameMessage, PlayerType, SlotType, GamePhase } from '../../game';
import { StateUtils } from '../../game/store/state-utils';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Clefable extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Clefairy';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 100;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Follow Me',
    cost: [CardType.PSYCHIC],
    damage: 0,
    text: 'Switch in 1 of your opponent\'s Benched Pokémon to the Active Spot.'
  }, {
    name: 'More Moon',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC],
    damage: 50,
    text: 'If your opponent\'s Pokémon is Knocked Out by damage from this attack, take 1 more Prize card.'
  }];

  public set: string = 'MEW';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '36';

  public name: string = 'Clefable';

  public fullName: string = 'Clefable MEW';

  private usedMoreMoon = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Track when any attack named "More Moon" is used (including when copied by other Pokemon)
    if (effect instanceof AttackEffect && effect.attack.name === 'More Moon') {
      this.usedMoreMoon = true;
    }

    // Track when Follow Me attack is used (reset More Moon flag)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedMoreMoon = false;
    }

    // Follow Me - Switch opponent's benched Pokémon to active
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if opponent has any benched Pokémon
      if (opponent.bench.length === 0) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        opponent.active.clearEffects();
        opponent.switchPokemon(targets[0]);
        return state;
      });
    }

    // More Moon - Take 1 more prize if KO
    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Only activate during attack phase on opponent's turn
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }


      // Check if More Moon attack was used
      if (this.usedMoreMoon === true) {
        if (effect.prizeCount > 0) {
          effect.prizeCount += 1;
          this.usedMoreMoon = false;
        }
      }

      return state;
    }

    return state;
  }
}
