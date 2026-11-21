import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { GameMessage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, SWITCH_IN_OPPONENT_BENCHED_POKEMON, CONFIRMATION_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Nidoking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nidorino';
  public hp: number = 130;
  public cardType: CardType = P;
  public weakness = [{ type: P, value: +30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Poison Rub',
    cost: [C, C],
    damage: 20,
    text: 'The Defending Pokémon is now Poisoned. Before doing damage, you may switch 1 of the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. The new Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Pride Attack',
    cost: [P, P, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'Flip a coin for each Nidoqueen on your Bench. This attack does 60 damage plus 30 more damage for each heads.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Nidoking';
  public fullName: string = 'Nidoking SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Poison Rub switches before damage and Poisons the Pokémon that took the hit.
    if (WAS_ATTACK_USED(effect, 0, this) && effect.opponent.bench.some(slot => slot.getPokemonCard())) {
      return CONFIRMATION_PROMPT(store, state, effect.player, confirmed => {
        if (confirmed) SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, effect.player, { sourceEffect: effect });
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    if (AFTER_ATTACK(effect, 0, this) && effect.opponent.active === effect.originalDefender) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, effect);
    }

    // Pride Attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let nidoqueenCount = 0;
      player.bench.forEach(bench => {
        if (bench.getPokemonCard()?.name === 'Nidoqueen') {
          nidoqueenCount++;
        }
      });
      if (nidoqueenCount === 0) {
        return state;
      }
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, nidoqueenCount, results => {
        effect.damage += 30 * results.filter(r => r).length;
      });
    }

    return state;
  }
}
