import { queueBenchPlayAbility } from '../../game/store/prefabs/bench-play-reactions';
import { DISCARD_A_STADIUM_CARD_IN_PLAY } from '../../game/store/stadium-utils';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, ConfirmPrompt, GameMessage, StateUtils, ChooseEnergyPrompt, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterPlayBasicFromHandEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class ChienPao extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = W;

  public hp: number = 120;

  public weakness = [{ type: M }];

  public retreat = [C];

  public powers = [{
    name: 'Snow Sink',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may discard a Stadium in play.'
  }];

  public attacks = [
    {
      name: 'Icicle Loop',
      cost: [W, W, C],
      damage: 120,
      text: 'Put an Energy attached to this Pokémon into your hand.'
    }
  ];

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '56';

  public name: string = 'Chien-Pao';

  public fullName: string = 'Chien-Pao SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterPlayBasicFromHandEffect && effect.pokemonCard === this) {
      if (!StateUtils.getStadiumCard(state)) return state;
      queueBenchPlayAbility(store, state, effect, () => {
        const stadiumCard = StateUtils.getStadiumCard(state);
        if (stadiumCard !== undefined) {

          state = store.prompt(state, new ConfirmPrompt(
            effect.player.id,
            GameMessage.WANT_TO_USE_ABILITY,
          ), wantToUse => {
            if (wantToUse) {

              // Discard Stadium
              DISCARD_A_STADIUM_CARD_IN_PLAY(state);
              return state;
            }
            return state;
          });
        }
      });
    }

    return ChienPao.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (!player.active.energies.cards.some(c => c.superType === SuperType.ENERGY)) {
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
        player.active.moveCardsTo(cards, player.hand);
      });
    }

    return state;
  }
}