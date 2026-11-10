import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { GET_PLAYER_PRIZES, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Carbink extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp = 90;
  public cardType: CardType = F;
  public weakness = [{ type: G }];
  public retreat = [C];
  public powers = [{ name: 'Double Type', powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in play, it is Fighting and Psychic type.' }];
  public attacks = [{ name: 'Counter Jewel', cost: [F, F, C], damage: 70, damageCalculation: '+' as '+',
    text: 'If your opponent has 2 or fewer Prize cards remaining, this attack does 100 more damage.' }];
  public regulationMark = 'J';
  public set = 'ASC';
  public cardImage = 'assets/cardback.png';
  public setNumber = '117';
  public name = 'Carbink';
  public fullName = 'Carbink ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-cosmic-eclipse/gallade.ts (Double Type)
    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
      const owner = state.players.find(player => player.active === effect.target || player.bench.includes(effect.target));
      if (owner && !IS_ABILITY_BLOCKED(store, state, owner, this)) {
        if (!effect.cardTypes.includes(F)) effect.cardTypes.push(F);
        if (!effect.cardTypes.includes(P)) effect.cardTypes.push(P);
      }
    }
    // Ref: set-cosmic-eclipse/ultra-necrozma.ts (opponent's remaining Prize cards)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (GET_PLAYER_PRIZES(opponent).length <= 2) effect.damage += 100;
    }
    return state;
  }
}
