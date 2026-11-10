import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { conditionAfterDamage } from '../set-great-encounters/ge-attack-effects';
import { SpecialCondition } from '../../game/store/card/card-types';
import { PlayerType } from '../../game/store/actions/play-card-action';

export class Kricketune extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Kricketot";
  public cardType: CardType = G;
  public hp = 80;
  public weakness = [{ type: R, value: 20 }];
  public retreat = [C, C];
  public attacks = [{
    name: "Sore Performance", cost: [C, C], damage: 20,
    text: "The Defending Pokémon is now Asleep."
  }, {
    name: "Concerto", cost: [G, G], damage: 40, damageCalculation: "+",
    text: "Does 40 damage plus 10 more damage for each Kricketot and each Kricketune you have in play."
  } ];
  public set = "MT";
  public setNumber = "27";
  public cardImage = 'assets/cardback.png';
  public name = "Kricketune";
  public fullName = "Kricketune MT";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-great-encounters/ge-attack-effects.ts (condition on original defender).
    if (WAS_ATTACK_USED(effect, 0, this)) conditionAfterDamage(state, effect, SpecialCondition.ASLEEP);
    // Ref: set-surging-sparks/passimian.ts (count own in-play Pokémon).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      let count = 0;
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, slot => {
        if (['Kricketot', 'Kricketune'].includes(slot.getPokemonCard()?.name || '')) count++;
      });
      effect.damage += count * 10;
    }
    return state;
  }
}
