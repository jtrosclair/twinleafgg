import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Bouffalant extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 100;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Curly Wall',
    powerType: PowerType.ABILITY,
    text: 'If you have any other Bouffalant in play, each of your Basic [C] Pokémon take 60 less damage from your opponent\'s attacks (after applying Weakness and Resistance). You can\'t apply more than 1 Curly Wall Ability at a time.'
  }];
  public attacks = [{
    name: 'Boundless Power',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 130,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public set: string = 'SCR';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '119';
  public name: string = 'Bouffalant';
  public fullName: string = 'Bouffalant SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.source.getPokemonCard()
      && effect.target.getPokemonCard()?.stage === Stage.BASIC) {
      const defender = StateUtils.findOwner(state, effect.target);
      if (defender !== effect.player && StateUtils.isPokemonInPlay(defender, this)
        && defender.getPokemonInPlay().some(slot => {
          const pokemon = slot.getPokemonCard();
          return pokemon !== this && pokemon?.name === 'Bouffalant';
        }) && !IS_ABILITY_BLOCKED(store, state, defender, this)) {
        const type = new CheckPokemonTypeEffect(effect.target);
        state = store.reduceEffect(state, type);
        if (type.cardTypes.includes(CardType.COLORLESS)) {
          effect.reduceDamageAfterWeakness(60, this.powers[0].name);
        }
      }
    }
    return Bouffalant.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(_store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.source.cannotAttackNextTurnPending = true;
    }
    return state;
  }
}
