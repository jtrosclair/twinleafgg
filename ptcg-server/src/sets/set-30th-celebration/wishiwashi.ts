import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, GamePhase, StateUtils } from "../../game";
import { AfterDamageEffect } from "../../game/store/effects/attack-effects";
import { Effect } from "../../game/store/effects/effect";
import { PlaceDamageCountersEffect } from "../../game/store/effects/game-effects";
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED, COIN_FLIP_PROMPT } from "../../game/store/prefabs/prefabs";

export class Wishiwashi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 30;
  public cardType: CardType = CardType.WATER;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Counterattack Grouping',
    powerType: PowerType.ABILITY,
    text: 'If your Wishiwashi or Wishiwashi ex is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if your Pokémon is Knocked Out), place 3 damage counters on the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Surprise Attack',
    cost: [CardType.WATER],
    damage: 30,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public regulationMark: string = 'J';

  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Wishiwashi';
  public fullName: string = 'Wishiwashi 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-pokemon-151/hitmonchan.ts (Ability counters after attack damage).
    if (effect instanceof AfterDamageEffect && effect.damage > 0 && state.phase === GamePhase.ATTACK) {
      const owner = StateUtils.findOwner(state, effect.target);
      const activeCard = owner.active.getPokemonCard();
      if (owner !== effect.player && effect.target === owner.active && effect.source.getPokemonCard()
        && (activeCard?.name === 'Wishiwashi' || activeCard?.name === 'Wishiwashi ex')
        && StateUtils.isPokemonInPlay(owner, this) && !IS_ABILITY_BLOCKED(store, state, owner, this)) {
        state = store.reduceEffect(state, new PlaceDamageCountersEffect(owner, effect.source, 30, this, this.powers[0]));
      }
    }

    // Surprise Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
