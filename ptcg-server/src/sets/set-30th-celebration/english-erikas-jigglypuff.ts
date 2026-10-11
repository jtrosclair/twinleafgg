import { PokemonCard, Stage, CardType, StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

// Printed English text: https://limitlesstcg.com/cards/30C/CC4
export class EnglishErikasJigglypuffCC4 extends PokemonCard {
  public stage = Stage.BASIC;
  public hp = 50;
  public cardType = CardType.COLORLESS;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];
  public retreat = [CardType.COLORLESS];
  public set = '30C';
  public setNumber = 'CC4';
  public usSetNumber = '30C CC4';
  public name = "Erika's Jigglypuff";
  public fullName = "Erika's Jigglypuff 30C CC4";
  public cardImage = 'assets/cardback.png';
  public attacks = [{
    name: 'Group Therapy', cost: [CardType.COLORLESS], damage: 0,
    text: 'You and your opponent remove 1 damage counter from each of your Pokémon with damage counters on them.'
  }, {
    name: 'Pulled Punch', cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 40, damageCalculation: '-',
    text: 'If the Defending Pokémon has no damage counters on it, this attack does 40 damage. If it has any damage counters on it, this attack does 10 damage.'
  }];
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      for (const player of [effect.player, effect.opponent]) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, target => {
          if (target.damage > 0) { store.reduceEffect(state, new HealEffect(player, target, 10)); }
        });
      }
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.damage = effect.opponent.active.damage === 0 ? 40 : 10;
    }
    return state;
  }
}
