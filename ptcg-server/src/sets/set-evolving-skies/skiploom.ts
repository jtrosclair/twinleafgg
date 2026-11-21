import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, GamePhase, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { queuePokemonEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { CONFIRMATION_PROMPT, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class Skiploom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Hoppip';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];

  public powers = [{
    name: 'Solar Evolution',
    powerType: PowerType.ABILITY,
    text: 'When you attach an Energy card from your hand to this Pokémon during your turn,'
      + ' you may search your deck for a card that evolves from this Pokémon and put it onto this Pokémon to evolve it.'
      + 'Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Spinning Attack',
    cost: [CardType.GRASS],
    damage: 20,
    text: ''
  }];

  public set: string = 'EVS';
  public regulationMark: string = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Skiploom';
  public fullName: string = 'Skiploom EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.target.getPokemonCard() === this) {
      const { player, target } = effect;
      const canUse = () => state.players[state.activePlayer] === player
        && (state.phase === GamePhase.PLAYER_TURN || state.phase === GamePhase.ATTACK)
        && target.getPokemonCard() === this && player.deck.cards.length > 0;
      queuePokemonEnergyReaction(store, state, effect, this, () => {
        CONFIRMATION_PROMPT(store, state, player, accepted => {
          if (!accepted || !canUse()) return;
          store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck,
            { superType: SuperType.POKEMON, stage: Stage.STAGE_2, evolvesFrom: this.name },
            { min: 0, max: 1, allowCancel: false }), selected => {
            const evolution = selected[0];
            if (evolution instanceof PokemonCard && canUse() && player.deck.cards.includes(evolution)) {
              store.reduceEffect(state, new EvolveEffect(player, target, evolution, player.deck));
            }
            SHUFFLE_DECK(store, state, player);
          });
        });
      }, canUse);
    }

    return state;
  }
}