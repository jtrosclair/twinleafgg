import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { searchEnergyEvolution } from '../../game/store/prefabs/energy-evolution';
import { getAttachedEnergyTypes, queuePokemonEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Eevee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Energy Evolution',
    powerType: PowerType.POKEMON_POWER,
    text: 'Whenever you attach an Energy card to Eevee, flip a coin. If heads, search your deck for a card that evolves from Eevee that is the same type as the Energy card you attached to Eevee. Attach that card to Eevee. This counts as evolving Eevee. Shuffle your deck afterward. This power can\'t be used if Eevee is Asleep, Confused, or Paralyzed.',
  }];

  public attacks = [{
    name: 'Smash Kick',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'N2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Eevee';
  public fullName: string = 'Eevee N2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterAttachEnergyEffect && effect.recipientAtAttachment === this) {
      const { player, target, energyCard } = effect;
      const canUse = () => target.getPokemonCard() === this && target.cards.includes(energyCard)
        && target.specialConditions.length === 0;
      queuePokemonEnergyReaction(store, state, effect, this, () => {
        COIN_FLIP_PROMPT(store, state, player, heads => {
          if (heads && canUse()) {
            searchEnergyEvolution(store, state, effect, this, getAttachedEnergyTypes(store, state, effect));
          }
        });
      }, canUse);
    }
    return state;
  }
}
