import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonStatsEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class LilliesClefairyex extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.LILLIES];
  public cardType: CardType = P;
  public hp: number = 190;
  public weakness = [{ type: M }];
  public retreat = [C];

  public powers = [{
    name: 'Fairy Zone',
    powerType: PowerType.ABILITY,
    text: 'The Weakness of each of your opponent\'s [N] Pokémon in play is now [P]. (Apply Weakness as x2.) ',
  }];

  public attacks = [
    {
      name: 'Full Moon Rondo',
      cost: [P, C],
      damage: 20,
      damageCalculation: '+',
      text: 'This attack does 20 more damage for each Benched Pokémon (both yours and your opponent\'s).'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'JTG';
  public setNumber: string = '56';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lillie\'s Clefairy ex';
  public fullName: string = 'Lillie\'s Clefairy ex JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Fairy Zone
    if (effect instanceof CheckPokemonStatsEffect) {
      const targetOwner = StateUtils.findOwner(state, effect.target);
      const owner = StateUtils.getOpponent(state, targetOwner);
      if (!StateUtils.isPokemonInPlay(owner, this) || IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const types = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, types);
      if (types.cardTypes.includes(CardType.DRAGON)
        && CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, this.powers[0], this, effect.target)) {
        effect.weakness = [{ type: CardType.PSYCHIC }];
      }
    }

    return LilliesClefairyex.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  /** Full Moon Rondo belongs to the attack; Fairy Zone belongs to the card. */
  public reduceCopiedAttackEffect(_store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Full Moon Rondo
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      //Get number of benched pokemon
      const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      const totalBenched = playerBenched + opponentBenched;

      effect.damage = 20 + totalBenched * 20;
    }
    return state;
  }
}