import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils } from '../../game';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect, PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { WAS_POWER_USED, IS_ABILITY_BLOCKED, USE_ABILITY_ONCE_PER_TURN, ABILITY_USED, REMOVE_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class Phantump extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Envious Evolution',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put a card from your hand that evolves from this Pokemon onto it to evolve it. Then, put 2 damage counters on this Pokemon. You can\'t use this Ability during your first turn.'
  }];

  public attacks = [{
    name: 'Mumble',
    cost: [P],
    damage: 10,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public usSetNumber = 'CRI 38';
  public name: string = 'Phantump';
  public fullName: string = 'Phantump M4';

  public readonly ENVIOUS_EVOLUTION_MARKER = 'ENVIOUS_EVOLUTION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (state.turn <= 2) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const target = StateUtils.findPokemonSlot(state, this);
      if (target?.getPokemonCard() !== this || target.cannotEvolveNextTurn) {
        throw new GameError(GameMessage.CANNOT_EVOLVE);
      }

      const isEvolution = (card: unknown): card is PokemonCard =>
        card instanceof PokemonCard && card.stage === Stage.STAGE_1 && card.evolvesFrom === this.name;
      if (!player.hand.cards.some(isEvolution)) throw new GameError(GameMessage.CANNOT_USE_POWER);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_EVOLVE,
        player.hand,
        { superType: SuperType.POKEMON, stage: Stage.STAGE_1, evolvesFrom: this.name },
        { min: 0, max: 1, allowCancel: true }
      ), cards => {
        const evolution = cards?.[0];
        if (!isEvolution(evolution)) return state;

        USE_ABILITY_ONCE_PER_TURN(player, this.ENVIOUS_EVOLUTION_MARKER, this);
        ABILITY_USED(player, this);

        // Ref: set-darkness-ablaze/pokemon-breeders-nurturing.ts (complete an effect
        // before dispatching the evolution reactions).
        const evolve = new EvolveEffect(player, target, evolution, player.hand, true);
        evolve.completionBatch = [];
        state = store.reduceEffect(state, evolve);
        if (target.getPokemonCard() === evolution) {
          state = store.reduceEffect(state, new PlaceDamageCountersEffect(player, target, 20, this, this.powers[0]));
        }
        for (const completed of evolve.completionBatch) state = store.reduceEffect(state, completed);
        return state;
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ENVIOUS_EVOLUTION_MARKER, this);

    return state;
  }
}
