// Research only. This deliberately red case is outside the six-card restoration fix.
// Copy to src/sets/tests in a disposable checkout to run it.
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, SuperType } from '../../game/store/card/card-types';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { Store } from '../../game/store/store';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Electrode } from '../set-base-set/electrode';

class BuzzapHolder extends PokemonCard {
  public name = 'Buzzap holder';
  public fullName = 'Buzzap holder RESEARCH';
  public set = 'RESEARCH';
  public hp = 100;
}

describe('Buzzap chosen Energy type - deferred research', () => {
  it('preserves an already attached Electrode and its chosen Energy after restoration', () => {
    // Construct the state AFTER Buzzap has selected Water and attached Electrode.
    // This isolates serializer field loss; it does not claim to replay the power.
    const state = new State(), player = new Player(), opponent = new Player();
    player.id = 1; opponent.id = 2; state.players = [player, opponent];
    state.phase = GamePhase.PLAYER_TURN; state.turn = 2;
    const holder = new BuzzapHolder(), electrode = new Electrode(), other = new BuzzapHolder();
    [holder, electrode, other].forEach((card, index) => card.id = index);
    electrode.superType = SuperType.ENERGY;
    electrode.chosenEnergyType = CardType.WATER;
    electrode.provides = [CardType.WATER, CardType.WATER];
    player.active.cards = [holder, electrode]; player.active.energies.cards = [electrode];
    opponent.active.cards = [other]; state.cardNames = [holder.fullName, electrode.fullName, other.fullName];
    CardManager.getInstance().defineSet([new BuzzapHolder(), new Electrode()]);
    StateSerializer.setKnownCards(CardManager.getInstance().getAllCards());

    const liveStore = new Store({ onStateChange() {} }); liveStore.state = state;
    const liveEnergy = new CheckProvidedEnergyEffect(player, player.active);
    liveStore.reduceEffect(state, liveEnergy);
    expect(liveEnergy.energyMap.find(item => item.card === electrode)!.provides)
      .toEqual([CardType.WATER, CardType.WATER]);

    const serializer = new StateSerializer(), restored = serializer.deserialize(serializer.serialize(state));
    const attached = restored.players[0].active.energies.cards[0] as Electrode;
    expect(attached).toBe(restored.players[0].active.cards[1]);
    // All three assertions currently fail. The wire stores the printed identity,
    // not the runtime choice, so the choice cannot be recovered from placement.
    expect(attached.superType).toBe(SuperType.ENERGY);
    expect(attached.chosenEnergyType).toBe(CardType.WATER);
    expect(attached.provides).toEqual([CardType.WATER, CardType.WATER]);
  });
});
