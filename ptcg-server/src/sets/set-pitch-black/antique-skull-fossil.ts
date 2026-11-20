import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, PokemonType, TrainerType } from '../../game/store/card/card-types';
import { GameError, GameLog, GameMessage, Power, PowerType, State, StateUtils, StoreLike, TrainerCard } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { PlayItemEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED, MOVE_CARDS, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class AntiqueSkullFossil extends TrainerCard {
  public trainerType = TrainerType.ITEM;
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public cardTypez: CardType = CardType.COLORLESS;
  public movedToActiveThisTurn = false;
  public pokemonType = PokemonType.NORMAL;
  public evolvesFrom = '';
  public cardTag = [];
  public tools = [];
  public evolvesTo = ['Cranidos'];
  public evolvesToStage = [];
  public archetype = [];
  public hp: number = 60;
  public weakness = [];
  public retreat = [];
  public resistance = [];
  public attacks = [];
  public maxTools: number = 1;
  public evolvesFromBase: string[] = [];

  public powers: Power[] = [{
    name: 'Spiky Skull',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and takes damage from an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), put 3 damage counters on the attacking Pokémon.',
  },
  {
    name: 'Antique Skull Fossil',
    text: `Play this card as if it were a 60-HP Basic [C] Pokémon. This card can't be affected by any Special Conditions and can't retreat. At any time during your turn, you may discard this card from play.`,
    useWhenInPlay: true,
    exemptFromAbilityLock: true,
    isFossil: true,
    powerType: PowerType.TRAINER_ABILITY,
  }];

  public set: string = 'PBL';
  public setNumber: string = '73';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Antique Skull Fossil';
  public fullName: string = 'Antique Skull Fossil M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if ((effect instanceof AddSpecialConditionsEffect || effect instanceof AddSpecialConditionsPowerEffect)
      && effect.target.getPokemonCard() === this) {
      effect.preventDefault = true;
    }

    // Ref: set-ascended-heroes/hops-pincurchin-ex.ts (Counterattack Quills).
    const fossil = this as unknown as PokemonCard;
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: fossil })
      && !effect.preventDefault && effect.target.getPokemonCard() === fossil) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (!IS_ABILITY_BLOCKED(store, state, owner, fossil)) {
        state = store.reduceEffect(state, new PlaceDamageCountersEffect(owner, effect.source, 30, fossil, this.powers[0]));
      }
    }

    if (WAS_POWER_USED(effect, 1, this)) {
      const player = effect.player;
      store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: this.name, effect: this.powers[1].name });
      const cardList = StateUtils.findCardList(state, this);
      return MOVE_CARDS(store, state, cardList, player.discard);
    }

    if (effect instanceof PlayItemEffect && effect.trainerCard === this) {
      const player = effect.player;
      const emptySlots = player.bench.filter(b => b.cards.length === 0);
      if (emptySlots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      const playPokemonEffect = new PlayPokemonEffect(player, this as unknown as PokemonCard, emptySlots[0]);
      store.reduceEffect(state, playPokemonEffect);
    }

    if (effect instanceof RetreatEffect && effect.player.active.getPokemonCard() === this) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }

    return state;
  }
}
