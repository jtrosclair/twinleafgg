import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { CardList, EnergyCard, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { revealCardsBeforeAttackCoins } from '../../game/store/prefabs/attack-coin-reflip';
import { DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK } from '../../game/store/prefabs/effect-of-attack-prefabs';
import { MOVE_CARDS, MULTIPLE_COIN_FLIPS_PROMPT, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Octillery extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Remoraid';
  public hp: number = 90;
  public cardType: CardType = W;
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Water Vein',
    cost: [],
    damage: 50,
    damageCalculation: 'x',
    text: 'Reveal the top 5 cards of your deck. Flip a coin for each Energy card you find there. This attack does 50 damage times the number of heads. Shuffle the revealed cards back into your deck.'
  }, {
    name: 'Octazooka',
    cost: [W, W],
    damage: 40,
    text: 'Any time the Defending Pokémon tries to attack, your opponent flips a coin. If tails, that attack does nothing. (If the Defending Pokémon is no longer your opponent\'s Active Pokémon, this effect ends.)'
  }];

  public set: string = 'PL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Octillery';
  public fullName: string = 'Octillery PL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Water Vein
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      effect.damage = 0;
      if (!player.deck.cards.length) return state;

      const deckTop = new CardList();
      const sourceCard = effect.source.getPokemonCard() ?? this;
      MOVE_CARDS(store, state, player.deck, deckTop, { count: 5, sourceCard, sourceEffect: effect });
      const revealed = deckTop.cards.slice();
      const energyCount = revealed.filter(card => card instanceof EnergyCard).length;
      if (!revealed.length) return state;

      afterAttackDamage(state, effect, (store, next) => {
        MOVE_CARDS(store, next, deckTop, player.deck, { cards: revealed, sourceCard, sourceEffect: effect });
        return SHUFFLE_DECK(store, next, player);
      });
      return revealCardsBeforeAttackCoins(store, state, effect, revealed, () => {
        if (energyCount > 0) {
          MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, energyCount, results => {
            effect.damage = 50 * results.filter(Boolean).length;
          });
        }
      });
    }

    // Octazooka
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(store, state, effect, this, 1, 'while-active');
    }

    return state;
  }
}
