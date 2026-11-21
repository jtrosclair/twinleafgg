import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { GamePhase, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { queuePokemonEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { COIN_FLIP_PROMPT, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Forretress extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pineco';
  public hp: number = 90;
  public cardType: CardType = M;
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Iron Shell',
    powerType: PowerType.POKEBODY,
    text: 'Whenever you attach a basic Energy card from your hand to Forretress (excluding effects of attacks), flip a coin. If tails, put 2 damage counters on each Pokémon (both yours and your opponent\'s) (excluding any Forretress).'
  }];

  public attacks = [{
    name: 'Explosion',
    cost: [M, M, C, C],
    damage: 100,
    text: 'Forretress does 40 damage to itself.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Forretress';
  public fullName: string = 'Forretress LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Iron Shell
    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.target.getPokemonCard() === this
      && effect.energyCard.energyType === EnergyType.BASIC && state.phase !== GamePhase.ATTACK) {
      const { player } = effect;
      queuePokemonEnergyReaction(store, state, effect, this, () => {
        COIN_FLIP_PROMPT(store, state, player, heads => {
          if (heads) return;
          for (const owner of state.players) {
            for (const slot of owner.getPokemonInPlay()) {
              if (slot.getPokemonCard()?.name === 'Forretress') continue;
              store.reduceEffect(state, new PlaceDamageCountersEffect(player, slot, 20, this, this.powers[0]));
            }
          }
        });
      });
    }

    // Explosion
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 40);
    }

    return state;
  }
}
