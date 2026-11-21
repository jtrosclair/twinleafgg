import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { afterAttackDamageForOriginalDefender } from '../../../game/store/prefabs/post-damage-identity';
import { EffectOfAttackEffect } from '../../../game/store/effects/effect-of-attack-effects';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { CardType, ChooseEnergyPrompt, GameMessage, PokemonCard, Stage, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { StoreLike } from '../../../game/store/store-like';

class DesertWindEffect extends EffectOfAttackEffect {
  constructor(attack: AttackEffect, readonly applyEffect: () => void) { super(attack); }
}

export class Flygon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Vibrava';
  public hp: number = 150;
  public cardType: CardType = N;
  public weakness = [];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Desert Wind',
    cost: [G, F],
    damage: 90,
    text: 'You may choose 2 Energy attached to your opponent\'s Active Pokémon and shuffle them into your opponent\'s deck.'
  },
  {
    name: 'Speed Dive',
    cost: [G, F, C],
    damage: 150,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Flygon';
  public fullName: string = 'Flygon FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      afterAttackDamageForOriginalDefender(state, effect, (store, next, target) => {
        if (target.energies.cards.length === 0) return next;
        return store.reduceEffect(next, new DesertWindEffect(effect, () => {
          const { player, opponent } = effect;
          const energy = new CheckProvidedEnergyEffect(opponent, target);
          store.reduceEffect(next, energy);
          const energyMap = energy.energyMap.filter(entry => entry.provides.length > 0);
          const count = Math.min(2, energyMap.reduce((total, entry) => total + entry.provides.length, 0));
          if (count === 0) return;
          store.prompt(next, new ChooseEnergyPrompt(
            player.id, GameMessage.CHOOSE_CARD_TO_SHUFFLE, energyMap, Array<CardType>(count).fill(CardType.COLORLESS),
            { allowCancel: true }
          ), selected => {
            if (!selected?.length) return;
            const cards = selected.map(entry => entry.card);
            MOVE_CARDS(store, next, target, opponent.deck, { cards, sourceCard: this, sourceEffect: effect });
            SHUFFLE_DECK(store, next, opponent);
          });
        }));
      });
    }

    return state;
  }
}
