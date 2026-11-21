import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { PokemonCard, Stage, CardTag, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED, ADD_CONFUSION_TO_PLAYER_ACTIVE } from "../../game/store/prefabs/prefabs";

export class MegaMalamarex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Inkay';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = D;
  public hp: number = 320;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
      name: 'Psychic Marionettes',
      cost: [D, D],
      damage: 70,
      damageCalculation: 'x',
      text: "This attack does 70 damage for each of your opponent's Benched Pokémon.",
    },
    {
      name: 'Eerie Wave',
      cost: [D, D, D],
      damage: 200,
      text: "Your opponent's Active Pokémon is now Confused.",
    }];

  public regulationMark: string = 'J';
  public set: string = 'DLR';
  public setNumber: string = '69';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Malamar ex';
  public fullName: string = 'Mega Malamar ex M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psychic Marionettes
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const benchCount = effect.opponent.bench.filter(slot => slot.getPokemonCard()).length;
      effect.damage = benchCount ? effect.damage + 70 * benchCount - effect.attack.damage : 0;
    }

    // Eerie Pulse
    if (WAS_ATTACK_USED(effect, 1, this)) {
      afterAttackDamageForOriginalDefender(state, effect, (store, next) => {
        ADD_CONFUSION_TO_PLAYER_ACTIVE(store, next, effect.opponent, effect);
        return next;
      });
    }

    return state;
  }
}
