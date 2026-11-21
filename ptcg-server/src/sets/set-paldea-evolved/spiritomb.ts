import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { applyScopedAbilityLock } from '../../game/store/prefabs/ability-lock';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { returnPokemonToHand } from '../../game/store/prefabs/pokemon-replacement';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Spiritomb extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Fettered in Misfortune',
    powerType: PowerType.ABILITY,
    text: 'Basic Pokémon V in play (both yours and your opponent\'s) have ' +
      'no Abilities. '
  }];

  public attacks = [{
    name: 'Fade Out',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: 'Put this Pokémon and all attached cards into your hand. '
  }];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '89';

  public name: string = 'Spiritomb';

  public fullName: string = 'Spiritomb PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    applyScopedAbilityLock(store, state, effect, this, {
      affects: (_power, target) => target.stage === Stage.BASIC && target.tags.includes(CardTag.POKEMON_V),
    });

    // Ref: set-perfect-order/meowth-ex.ts (return the original attacker after damage).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const attacker = effect.source.getPokemonCard();
      afterAttackDamage(state, effect, (store, state) => {
        if (attacker && effect.source.getPokemonCard() === attacker) {
          returnPokemonToHand(store, state, effect.player, effect.source, true);
        }
        return state;
      });
    }
    return state;
  }
}
