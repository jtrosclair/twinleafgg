import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PowerType, StoreLike, State, TrainerCard, GameMessage } from '../../game';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ABILITY_USED, CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';

export class Meowthex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 170;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Last-Ditch Catch',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand to your Bench during your turn, you may use this Ability. Search your deck for a Supporter card, reveal it, and put it into your hand. You can\'t use this Ability if you\'ve already used another Ability with "Last-Ditch" in its name this turn.',
  }];

  public attacks = [{
    name: 'Tuck Tail',
    cost: [C, C, C],
    damage: 60,
    text: 'Return this Pokémon and all attached cards into your hand.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public usSetNumber = 'POR 62';
  public name: string = 'Meowth ex';
  public fullName: string = 'Meowth ex POR';
  public readonly TRUMP_CARD_MARKER = 'TRUMP_CARD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      if (player.marker.hasMarker(this.TRUMP_CARD_MARKER)) {
        // Ref: set-darkness-ablaze/crobat-v.ts (Dark Asset).
        // Skip the used ability while allowing this Pokemon to be benched.
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof TrainerCard && (card.trainerType !== TrainerType.SUPPORTER)) {
          blocked.push(index);
        }
      });

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          ABILITY_USED(player, this);
          player.marker.addMarkerToState(this.TRUMP_CARD_MARKER);
          SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false, blocked }, this.powers[0]);
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.TRUMP_CARD_MARKER)) {
      effect.player.marker.removeMarker(this.TRUMP_CARD_MARKER);
    }

    return Meowthex.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  /** Tuck Tail's after-attack return is separate from the Last-Ditch Ability. */
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (effect instanceof AfterAttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const source = player.active;
      const pokemons = source.getPokemons();
      // Class identity does not distinguish attachments: Holon Pokemon keep
      // their PokemonCard prototype while acting as Energy. Move every card
      // outside the evolution stack and tools before returning the stack.
      const otherCards = source.cards.filter(card =>
        !pokemons.includes(card as PokemonCard) &&
        (!source.tools || !source.tools.includes(card))
      );
      const tools = [...source.tools];
      source.clearEffects();

      // Move other cards to hand
      if (otherCards.length > 0) {
        MOVE_CARDS(store, state, source, player.hand, { cards: otherCards });
      }

      // Move tools to hand explicitly
      for (const tool of tools) {
        const previousHandCopies = player.hand.cards.filter(card => card === tool).length;
        source.moveCardTo(tool, player.hand);
        // A Tool also present in cards is moved physically by moveCardTo;
        // remove its remaining Tool alias only after a new hand entry arrived.
        if (player.hand.cards.filter(card => card === tool).length > previousHandCopies) {
          source.tools = source.tools.filter(attached => attached !== tool);
        }
      }

      // Move Pokémon to hand
      if (pokemons.length > 0) {
        MOVE_CARDS(store, state, source, player.hand, { cards: pokemons });
      }
      return state;
    }
    return state;
  }
}
