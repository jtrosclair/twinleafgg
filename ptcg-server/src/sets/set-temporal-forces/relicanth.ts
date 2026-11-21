import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonAttacksEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { COPY_ATTACK_VIA_ABILITY } from '../../game/store/prefabs/copy-attack-prefabs';
import { IS_ABILITY_BLOCKED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Relicanth extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 100;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Memory Dive',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Each of your evolved Pokémon can use any attack from its previous Evolutions. (You still need the necessary Energy to use each attack.)'
  }];

  public attacks = [
    {
      name: 'Razor Fin',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'TEF';

  public setNumber = '84';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Relicanth';

  public fullName: string = 'Relicanth TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect) {
      const owner = effect.player;
      if (owner && StateUtils.isPokemonInPlay(owner, this) && !IS_ABILITY_BLOCKED(store, state, owner, this)
        && owner.getPokemonInPlay().some(slot => StateUtils.isEvolutionPokemon(slot))) {
        owner.showAllStageAbilities = true;
      }
      return state;
    }

    if (!(effect instanceof CheckPokemonAttacksEffect) && !WAS_POWER_USED(effect, 0, this)) return state;
    const { player } = effect;
    const attacker = player.active.getPokemonCard();
    const previous = player.active.getPokemons().slice(0, -1).filter(card => card instanceof PokemonCard && card.attacks.length > 0);
    if (!attacker || !StateUtils.isEvolutionPokemon(player.active) || previous.length === 0
      || !StateUtils.isPokemonInPlay(player, this)) {
      if (effect instanceof CheckPokemonAttacksEffect) return state;
      throw new GameError(GameMessage.CANNOT_USE_POWER);
    }
    if (IS_ABILITY_BLOCKED(store, state, player, this)) {
      if (effect instanceof CheckPokemonAttacksEffect) return state;
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof CheckPokemonAttacksEffect) {
      for (const source of previous) {
        for (const attack of source.attacks) {
          if (effect.grantedAttackSources.has(attack)) continue;
          effect.attacks.push(attack);
          effect.grantedAttackSources.set(attack, source);
        }
      }
      return state;
    }

    // Retain the board's Ability menu for selecting an inherited attack.
    return COPY_ATTACK_VIA_ABILITY(store, state, effect, {
      copycatCard: attacker, filter: () => false, extraCards: previous,
    });
  }
}
