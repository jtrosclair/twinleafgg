import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage, State, StoreLike } from '../../game';
import {
  AFTER_ATTACK, CONFIRMATION_PROMPT, MOVE_CARDS, SWITCH_IN_OPPONENT_BENCHED_POKEMON
} from '../../game/store/prefabs/prefabs';

export class Cryogonal2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Ice Chain',
      cost: [W],
      damage: 0,
      text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon.'
    },
    {
      name: 'Frost Vanish',
      cost: [W, W],
      damage: 40,
      text: 'You may return this Pokémon and all cards attached to it to your hand.'
    }
  ];

  public set: string = 'NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Cryogonal';
  public fullName: string = 'Cryogonal NVI 33';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      return SWITCH_IN_OPPONENT_BENCHED_POKEMON(store, state, effect.player, {
        sourceEffect: effect.resolvedAttackEffect ?? effect
      });
    }

    // Ref: set-platinum/poke-turn.ts (return each physical attachment once).
    if (AFTER_ATTACK(effect, 1, this)) {
      const player = effect.player;
      const source = effect.resolvedAttackEffect?.source ?? player.active;
      const pokemon = source.getPokemonCard();
      if (!pokemon) return state;

      return CONFIRMATION_PROMPT(store, state, player, confirmed => {
        if (!confirmed || source.getPokemonCard() !== pokemon) return;
        const cards = [...new Set([...source.cards, ...source.energies.cards, ...source.tools])];
        MOVE_CARDS(store, state, source, player.hand, { cards, sourceCard: pokemon });
        source.tools = source.tools.filter(tool => !player.hand.cards.includes(tool));
        source.damage = 0;
        source.clearEffects();
      }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
    }

    return state;
  }
}
