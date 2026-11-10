import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ZangooseEx extends PokemonCard {
  public stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public hp = 200;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [
    { name: 'Spike Draw', cost: [C], damage: 20, text: 'Draw 2 cards.' },
    { name: 'Wild Scissors', cost: [C, C, C], damage: 180, text: 'This Pokémon also does 30 damage to itself.' }
  ];
  public regulationMark = 'J';
  public set = 'ASC';
  public cardImage = 'assets/cardback.png';
  public setNumber = '167';
  public name = 'Zangoose ex';
  public fullName = 'Zangoose ex ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-brilliant-stars/drampa-v.ts (Spike Draw).
    if (WAS_ATTACK_USED(effect, 0, this)) DRAW_CARDS(effect.player, 2);
    // Ref: set-paradox-rift/roaring-moon-ex.ts (attack recoil).
    if (WAS_ATTACK_USED(effect, 1, this)) THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    return state;
  }
}
