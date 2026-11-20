import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { ChoosePokemonPrompt, PlayerType, PowerType, SlotType, State, StoreLike } from '../../game';
import { GameMessage } from '../../game/game-message';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class GalarianZigzagoon extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Headbutt Tantrum',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may put 1 damage counter on 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Surprise Attack',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: 30,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public set: string = 'SSH';

  public name: string = 'Galarian Zigzagoon';

  public fullName: string = 'Galarian Zigzagoon SSH';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '117';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && effect.slot === SlotType.BENCH
      && effect.player.hand.cards.includes(this) && state.players[state.activePlayer] === effect.player) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: true },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          // Ref: upstream 49205ef174 (preventable Ability damage counters).
          store.reduceEffect(state, new PlaceDamageCountersEffect(player, target, 10, this, this.powers[0]));
        });
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
        if (!heads) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }

}
