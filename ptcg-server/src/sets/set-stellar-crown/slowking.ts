import { PokemonCard, pokemonHasRuleBox } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, Resistance } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COPY_ATTACK_FROM_POKEMON_LIST } from '../../game/store/prefabs/copy-attack-prefabs';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Slowking extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Slowpoke';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.DARK }];

  public resistance: Resistance[] = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Seek Inspiration',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: 0,
      text: 'Discard the top card of your deck, and if that card is a Pokemon that doesn\'t have a Rule Box, ' +
        'choose 1 of its attacks and use it as this attack. (Pokemon ex, Pokemon V, etc. have Rule Boxes.)'
    },
    { name: 'Super Psy Bolt', cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS], damage: 120, text: '' }
  ];

  public set: string = 'SCR';

  public name: string = 'Slowking';

  public fullName: string = 'Slowking SCR';

  public setNumber: string = '58';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const { player } = effect;
      const top = player.deck.cards[0];
      if (!top) return state;
      player.deck.moveTo(player.discard, 1);
      if (top instanceof PokemonCard && !pokemonHasRuleBox(top)
        && !top.tags.includes(CardTag.POKEMON_LV_X) && !top.tags.includes(CardTag.POKEMON_SV_MEGA)) {
        return COPY_ATTACK_FROM_POKEMON_LIST(store, state, effect, [top], {
          allowCancel: false, preserveInPlaySource: true,
        });
      }
    }

    return state;
  }
}
