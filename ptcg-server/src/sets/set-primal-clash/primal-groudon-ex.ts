import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { BLOCK_TRAINER_TARGET, DISCARD_A_STADIUM_CARD_IN_PLAY, IS_OPPOSING_TRAINER_TARGET, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class PrimalGroudonEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX, CardTag.MEGA, CardTag.PRIMAL];
  public stage: Stage = Stage.MEGA;
  public evolvesFrom = 'Groudon-EX';
  public cardType: CardType = F;
  public hp: number = 240;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public powers = [
    {
      name: 'Primal Reversion Rule',
      powerType: PowerType.MEGA_EVOLUTION_RULE,
      text: 'When 1 of your Pokémon becomes Primal Groudon-EX, your turn ends.'
    },
    {
      name: 'Ω Barrier',
      powerType: PowerType.ANCIENT_TRAIT,
      text: 'Whenever your opponent plays a Trainer card (excluding Pokémon Tools and Stadium cards), prevent all effects of that card done to this Pokémon.'
    },
  ];

  public attacks = [
    {
      name: 'Gaia Volcano',
      cost: [F, F, F, C],
      damage: 100,
      damageCalculation: '+',
      text: 'If there is any Stadium card in play, this attack does 100 more damage. Discard that Stadium card.'
    }
  ];

  public set: string = 'PRC';
  public name: string = 'Primal Groudon-EX';
  public fullName: string = 'Primal Groudon-EX PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ω Barrier is an Ancient Trait, so Ability suppression does not affect it.
    if (IS_OPPOSING_TRAINER_TARGET(state, effect, [TrainerType.ITEM, TrainerType.SUPPORTER])
      && effect.target.getPokemonCard() === this) {
      BLOCK_TRAINER_TARGET(effect);
    }

    // Gaia Volcano
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (StateUtils.getStadiumCard(state) === undefined) { return state; }
      effect.damage += 100;
      DISCARD_A_STADIUM_CARD_IN_PLAY(state);
    }

    return state;
  }

}
