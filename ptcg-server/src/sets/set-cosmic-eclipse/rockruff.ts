import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';

export class Rockruff extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 60;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Roar',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.'
    },
    {
      name: 'Rock Throw',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'CEC';
  public setNumber: string = '123';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rockruff';
  public fullName: string = 'Rockruff CEC';

  public usedRoar = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Roar
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      this.usedRoar = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedRoar === true) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const benched = opponent.bench.filter(b => b.cards.length > 0);
      if (benched.length === 0) {
        return state;
      }
      state = store.prompt(state, new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), targets => {
        this.usedRoar = false;
        if (!targets || targets.length === 0) {
          return;
        }
        opponent.switchPokemon(targets[0]);
      });
      return state;
    }

    return state;
  }
}
