import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, GamePhase, Card, ChooseEnergyPrompt, PokemonCardList, Attack } from '../../game';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN, HAS_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Bouffalant extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Ready to Ram',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 40,
      text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack ' +
        '(even if this Pokémon is Knocked Out), put 6 damage counters on the Attacking Pokémon.'
    },
    {
      name: 'Smashing Headbutt',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 150,
      text: 'Discard 2 Energy from this Pokémon.'
    }
  ];

  public set: string = 'SSP';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '151';

  public name: string = 'Bouffalant';

  public fullName: string = 'Bouffalant SSP';

  public readonly READY_TO_RAM_MARKER = 'BOUFFALANT_SSP_READY_TO_RAM_MARKER';
  public readonly CLEAR_READY_TO_RAM_MARKER = 'BOUFFALANT_SSP_CLEAR_READY_TO_RAM_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ready to Ram
    // Ref: set-paradox-rift/magby.ts (Scorching Heater)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      ADD_MARKER(this.READY_TO_RAM_MARKER, cardList, this);
      ADD_MARKER(this.CLEAR_READY_TO_RAM_MARKER, opponent, this);
    }

    if (effect instanceof PutDamageEffect
      && HAS_MARKER(this.READY_TO_RAM_MARKER, effect.target, this)
      && state.phase === GamePhase.ATTACK) {
      effect.source.damage += 60;
    }

    CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, this.CLEAR_READY_TO_RAM_MARKER, this.READY_TO_RAM_MARKER, this);

    // Smashing Headbutt
    // Ref: set-journey-together/salamence-ex.ts (Dragon Impact)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      if (!player.active.cards.some(c => c.superType === SuperType.ENERGY)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    return state;
  }
}
