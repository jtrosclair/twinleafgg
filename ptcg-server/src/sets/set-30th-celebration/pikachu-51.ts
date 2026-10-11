import { PokemonCard, Stage, CardType, StoreLike, State, EnergyCard } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from "../../game/store/prefabs/attack-effects";
import {WAS_ATTACK_USED, MOVE_CARDS } from "../../game/store/prefabs/prefabs";

/** #51 — Lightning Crash */
export class Pikachu51 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = CardType.LIGHTNING;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [{
    name: 'Lightning Crash',
    cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
    damage: 0,
    text: 'Discard all [L] Energy from this Pokémon, and this attack does 90 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 51';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lightning Crash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const providedEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, providedEnergy);
      const cards = [...new Set(providedEnergy.energyMap
        .filter(energy => energy.card instanceof EnergyCard
          && energy.provides.some(type => [CardType.LIGHTNING, CardType.ANY, CardType.WLFM, CardType.LPM].includes(type)))
        .map(energy => energy.card))];
      cards.forEach(c => { MOVE_CARDS(store, state, player.active, player.discard, { cards: [c], sourceCard: this }); });
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(90, effect, store, state);
    }
    return state;
  }
}
