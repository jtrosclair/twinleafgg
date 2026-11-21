import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, PowerType, SlotType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { setPokemonTypeForTurn } from '../../game/store/prefabs/temporary-pokemon-type';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { ABILITY_USED, ATTACH_ENERGY_PROMPT, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Weavile extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sneasel';
  public hp: number = 80;
  public cardType: CardType = W;
  public weakness = [{ type: M, value: +20 }];
  public retreat = [];

  public powers = [{
    name: 'Dark Engage',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may use this power. Each of your Active Pokémon\'s type is Darkness until the end of your turn. If that Pokémon is no longer your Active Pokémon, this effect ends.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Shadow Charge',
    cost: [],
    damage: 0,
    text: 'Search your deck for up to 2 Darkness Energy cards and attach them to any of your Pokémon in any way you like. Shuffle your deck afterward.'
  },
  {
    name: 'Chip Off',
    cost: [D, D],
    damage: 40,
    text: 'If your opponent has 6 or more cards in his or her hand, discard a number of cards without looking until your opponent has 5 cards left in his or her hand.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Weavile';
  public fullName: string = 'Weavile SW';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dark Engage
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);
      setPokemonTypeForTurn(state, player.active, CardType.DARK, true);
      return state;
    }

    // Shadow Charge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return ATTACH_ENERGY_PROMPT(
        store, state, player,
        PlayerType.BOTTOM_PLAYER, SlotType.DECK,
        [SlotType.ACTIVE, SlotType.BENCH],
        { name: 'Darkness Energy' },
        { min: 0, max: 2, allowCancel: true }
      );
    }

    // Ref: set-secret-wonders/honchkrow-lvx.ts (post-damage effects).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      afterAttackDamage(state, effect, (store, state) => {
        const hand = effect.opponent.hand;
        while (hand.cards.length > 5) {
          const card = hand.cards[Math.floor(Math.random() * hand.cards.length)];
          state = MOVE_CARDS(store, state, hand, effect.opponent.discard, { cards: [card], sourceCard: this });
          if (hand.cards.includes(card)) break;
        }
        return state;
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
