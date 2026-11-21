import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PowerType, SlotType } from '../..';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Gengar extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Haunter';

  public cardType: CardType = CardType.DARK;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Night Gate',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may switch your Active Pokémon with 1 of your Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Nightmare',
    cost: [CardType.DARK, CardType.COLORLESS],
    damage: 100,
    text: 'Your opponent\'s Active Pokémon is now Asleep.'
  }];

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '57';

  public set = 'PAF';

  public name: string = 'Gengar';

  public fullName: string = 'Gengar PAF';

  public readonly NIGHT_GATE_MARKER = 'NIGHT_GATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.NIGHT_GATE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.NIGHT_GATE_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      if (!player.bench.some(slot => slot.getPokemonCard())) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      USE_ABILITY_ONCE_PER_TURN(player, this.NIGHT_GATE_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      // Ref: set-black-bolt-white-flare/samurott.ts (complete the chosen friendly switch).
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH, PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH], { allowCancel: false },
      ), ([target]) => {
        if (target?.getPokemonCard() && player.bench.includes(target)) {
          player.switchPokemon(target, store, state);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialCondition);
      return state;
    }
    return state;
  }
}