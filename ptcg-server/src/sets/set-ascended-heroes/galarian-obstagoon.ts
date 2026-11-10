import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { ChooseEnergyPrompt, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GalarianObstagoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Galarian Linoone';
  public hp: number = 170;
  public cardType: CardType = D;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Scarring Shout',
    cost: [D, C],
    damage: 70,
    damageCalculation: 'x',
    text: 'This attack does 70 damage for each damage counter on your opponent\'s Active Pokémon.'
  },
  {
    name: 'Punk Smash',
    cost: [D, C, C],
    damage: 160,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '132';
  public name: string = 'Galarian Obstagoon';
  public fullName: string = 'Galarian Obstagoon ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scarring Shout. Ref: set-sword-and-shield/sableye-v.ts (damage counters on the opposing Active).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const damageCounters = Math.floor(opponent.active.damage / 10);
      effect.damage = 70 * damageCounters;
    }

    // Punk Smash. Ref: set-dragons-majesty/charmeleon.ts (discard an Energy).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      // This discards a card, not a unit of provided Energy. An attached
      // Special Energy or Pokémon-as-Energy remains selectable even if its
      // current effect provides no Energy.
      const attached = Array.from(new Set([
        ...effect.source.cards.filter(card => card.superType === SuperType.ENERGY),
        ...effect.source.energies.cards
      ]));
      if (attached.length === 0) {
        return state;
      }
      const choices = attached.map(card => ({ card, provides: [CardType.COLORLESS] }));
      return store.prompt(state, new ChooseEnergyPrompt(effect.player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD, choices, [CardType.COLORLESS],
        { allowCancel: false }), selected => {
        const discard = new DiscardCardsEffect(effect, (selected || []).map(choice => choice.card));
        discard.target = effect.source;
        return store.reduceEffect(state, discard);
      });
    }

    return state;
  }
}
