import { GameMessage, PlayerType, PowerType, State, StoreLike } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { ABILITY_USED, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED_FROM_HAND, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Blissey extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Chansey';
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Blissful Nurse',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: false,
    text: 'Once during your turn, when you play Blissey from your hand to evolve 1 of your Pokémon, you may remove all damage counters from all of your Pokémon. If you do, discard all Energy attached to those Pokémon that had any damage counters on them.'
  }];

  public attacks = [{
    name: 'Strength',
    cost: [C, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Blissey';
  public fullName: string = 'Blissey HS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED_FROM_HAND(effect, state, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          ABILITY_USED(player, this);
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            if (cardList.damage > 0) {
              const healEffect = new HealEffect(player, cardList, cardList.damage);
              state = store.reduceEffect(state, healEffect);

              const provided = new CheckProvidedEnergyEffect(player, cardList);
              store.reduceEffect(state, provided);
              const providedCards = new Set(provided.energyMap.map(entry => entry.card));
              const attached = cardList.cards.filter(card => card.superType === SuperType.ENERGY || providedCards.has(card));
              MOVE_CARDS(store, state, cardList, player.discard, {
                cards: attached, sourceCard: this, sourceEffect: this.powers[0],
              });
              // Some legacy snapshots store an attachment only in the Energy list.
              MOVE_CARDS(store, state, cardList.energies, player.discard, { sourceCard: this, sourceEffect: this.powers[0] });
            }
          });
        }
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    return state;
  }
}