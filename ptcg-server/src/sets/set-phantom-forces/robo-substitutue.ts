import { GameError, GameMessage, PokemonCard, Player, Power, PowerType, State, StateUtils, StoreLike, TrainerCard } from '../..';
import { CardType, PokemonType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { PlayItemEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class RoboSubstitute extends TrainerCard {

  public trainerType = TrainerType.ITEM;
  public superType = SuperType.TRAINER;

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;
  public cardTypez: CardType = CardType.COLORLESS;

  public movedToActiveThisTurn = false;

  public pokemonType = PokemonType.NORMAL;
  public evolvesFrom = '';
  public cardTag = [];
  public tools = [];
  public evolvesTo = [];
  public evolvesToStage = [];
  public archetype = [];
  public hp: number = 30;
  public weakness = [];
  public retreat = [];
  public resistance = [];
  public attacks = [];
  public attacksThisTurn: number = 0;
  public maxAttacksThisTurn: number = 1;
  public allowSubsequentAttackChoice: boolean = false;
  public evolvesFromBase: string[] = [];
  public maxTools: number = 1;
  public set: string = 'PHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name: string = 'Robo Substitute';
  public fullName: string = 'Robo Substitute PHF';

  public powers: Power[] = [
    {
      name: 'Robo Substitute',
      text: `Play this card as if it were a 30 HP [C] Basic Pokémon. At any time during your turn (before your attack), you may discard this card from play. 
      
      This card can't retreat. If this card is Knocked Out, your opponent can't take any Prize cards for it.`,
      useWhenInPlay: true,
      exemptFromAbilityLock: true,
      powerType: PowerType.TRAINER_ABILITY
    }
  ];

  // public text = 'Play this card as if it were a 30 HP [C] Basic Pokémon. At any time during your turn (before your attack), you may discard this card from play. This card can\'t retreat. If this card is Knocked Out, your opponent can\'t take any Prize cards for it.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      return discardRoboSubstitute(store, state, effect.player, this);
    }

    if (effect instanceof PlayItemEffect && effect.trainerCard === this) {
      const player = effect.player;

      const emptySlots = player.bench.filter(b => b.cards.length === 0);
      if (emptySlots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const playPokemonEffect = new PlayPokemonEffect(player, this as PokemonCard, emptySlots[0]);
      store.reduceEffect(state, playPokemonEffect);
    }

    if (effect instanceof RetreatEffect && effect.player.active.cards.includes(this)) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }

    if (effect instanceof KnockOutEffect && effect.target.getPokemonCard() === (this as unknown as PokemonCard)) {
      effect.prizeCount = 0;
      effect.preventPrizes = true;
      return state;
    }

    return state;
  }

}

// The same discard procedure applies to both registered names for this print.
export function discardRoboSubstitute(store: StoreLike, state: State, player: Player, card: TrainerCard): State {
  const slot = StateUtils.findPokemonSlot(state, card);
  if (!slot || slot.getPokemonCard() !== (card as unknown as PokemonCard)
    || StateUtils.findOwner(state, slot) !== player) return state;

  const cards = [...new Set([...slot.cards, ...slot.energies.cards, ...slot.tools])];
  state = MOVE_CARDS(store, state, slot, player.discard, { cards, sourceCard: card });
  if (!slot.getPokemonCard()) {
    slot.tools = [];
    slot.damage = 0;
    slot.clearEffects();
  }
  return state;
}
