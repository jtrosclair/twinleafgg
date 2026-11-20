import { CardType, GameError, GameLog, GameMessage, Player, PokemonCard, PokemonType, Power, PowerType,
  Stage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { RetreatEffect } from '../../game/store/effects/game-effects';
import { PlayItemEffect, PlayPokemonEffect, PlayStadiumEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED, MOVE_CARDS, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class AntiqueHelixFossil extends TrainerCard {
  public trainerType = TrainerType.ITEM;
  public regulationMark = 'G';
  public stage = Stage.BASIC;
  public cardType = CardType.COLORLESS;
  public pokemonType = PokemonType.NORMAL;
  public hp = 60;
  public weakness = [];
  public resistance = [];
  public retreat = [];
  public attacks = [];
  public cardTag = [];
  public archetype = [];
  public tools = [];
  public movedToActiveThisTurn = false;
  public evolvesFrom = '';
  public evolvesFromBase = [];
  public evolvesTo = ['Omanyte'];
  public evolvesToStage = [];
  public maxTools = 1;
  public maxAttacksThisTurn = 1;

  public text = 'Play this card as if it were a 60-HP Basic [C] Pokémon. This card can\'t be affected by any Special Conditions and can\'t retreat. At any time during your turn, you may discard this card from play.';

  public powers: Power[] = [{
    name: 'Helical Swell',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent can\'t play any Stadium cards from their hand.',
  }, {
    name: 'Antique Helix Fossil',
    powerType: PowerType.TRAINER_ABILITY,
    text: this.text,
    useWhenInPlay: true,
    exemptFromAbilityLock: true,
    isFossil: true,
  }];

  public set = 'MEW';
  public cardImage = 'assets/cardback.png';
  public setNumber = '153';
  public name = 'Antique Helix Fossil';
  public fullName = 'Antique Helix Fossil MEW';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    return player.bench.some(slot => slot.cards.length === 0);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const fossil = this as unknown as PokemonCard;
    if (effect instanceof PlayItemEffect && effect.trainerCard === this) {
      const slot = effect.player.bench.find(bench => bench.cards.length === 0);
      if (!slot) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      return store.reduceEffect(state, new PlayPokemonEffect(effect.player, fossil, slot));
    }

    if (effect instanceof RetreatEffect && effect.player.active.getPokemonCard() === fossil) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }

    if ((effect instanceof AddSpecialConditionsEffect || effect instanceof AddSpecialConditionsPowerEffect)
      && effect.target.getPokemonCard() === fossil) {
      effect.preventDefault = true;
    }

    if (WAS_POWER_USED(effect, 1, fossil)) {
      const player = effect.player;
      store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: this.name, effect: this.name });
      return MOVE_CARDS(store, state, StateUtils.findCardList(state, this), player.discard);
    }

    // Ref: upstream c304e3028, using the fossil owner's Ability suppression state.
    if (effect instanceof PlayStadiumEffect && effect.player.hand.cards.includes(effect.trainerCard)) {
      const owner = StateUtils.getOpponent(state, effect.player);
      if (owner.active.getPokemonCard() === fossil && !IS_ABILITY_BLOCKED(store, state, owner, fossil)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    return state;
  }
}
