import { PokemonCard, Stage, CardType, StoreLike, State, PowerType } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { REDUCE_ATTACK_DAMAGE_FROM_ABILITY } from "../../game/store/prefabs/effect-of-ability-prefabs";

/** #28 — Lonely Gaze + Pika Ball */
export class Pikachu28 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = CardType.LIGHTNING;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];
  public powers = [{
    name: 'Lonely Gaze',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, attacks used by your opponent\'s Active Pokémon do 20 less damage (before applying Weakness and Resistance).'
  }];
  public attacks = [{
    name: 'Pika Ball',
    cost: [CardType.LIGHTNING, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 28';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-obsidian-flames/entei.ts (Pressure).
    const owner = state.players.find(player => player.active.getPokemonCard() === this);
    if (owner) REDUCE_ATTACK_DAMAGE_FROM_ABILITY(store, state, effect, owner, this, 20);

    return state;
  }
}
