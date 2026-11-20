import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { APPLY_ONCE_PER_CARD, IS_TOOL_BLOCKED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';


export class HerosMedal extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public regulationMark = 'D';

  public set: string = 'VIV';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '152';

  public name: string = 'Hero\'s Medal';

  public fullName: string = 'Hero\'s Medal VIV';

  public text: string =
    'The Pokémon VMAX this card is attached to gets -100 HP, and if it is Knocked Out by damage from an attack from your opponent\'s Pokémon, that player takes 1 fewer Prize card. You can\'t attach this card to a Pokémon VMAX that has 100 HP or less remaining.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckHpEffect && effect.target.tools.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) { return state; }

      // Only reduce HP for VMAX Pokemon
      if (pokemonCard?.tags.includes(CardTag.POKEMON_VMAX) && APPLY_ONCE_PER_CARD(effect, this)) {
        effect.hp -= 100;
      }
    }

    if (WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect) && effect.target.tools.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) { return state; }

      // Only reduce prize count if it's a VMAX Pokemon
      if (pokemonCard?.tags.includes(CardTag.POKEMON_VMAX) && APPLY_ONCE_PER_CARD(effect, this)) {
        effect.prizeCount -= 1;
      }
    }

    return state;
  }
}
