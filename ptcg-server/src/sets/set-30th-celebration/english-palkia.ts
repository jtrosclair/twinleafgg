import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

// Printed text: https://api.tcgdex.net/v2/en/cards/30th-020
export class EnglishPalkia20 extends PokemonCard {
  public stage = Stage.BASIC;
  public hp = 130;
  public cardType = CardType.WATER;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public regulationMark = 'J';
  public set = '30C';
  public setNumber = '20';
  public usSetNumber = '30C 20';
  public name = 'Palkia';
  public fullName = 'Palkia 30C';
  public cardImage = 'assets/cardback.png';
  public attacks = [{
    name: 'Wormhole', cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS], damage: 100,
    text: "Switch this Pokémon with 1 of your Benched Pokémon. If you do, switch out your opponent's Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)"
  }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterAttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      if (!player.bench.some(b => b.cards.length > 0)) { return state; }
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id, GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH], { min: 1, max: 1, allowCancel: false }
      ), selected => {
        if (!selected || selected.length === 0) { return; }
        player.switchPokemon(selected[0], store, state);
        SWITCH_ACTIVE_WITH_BENCHED(store, state, StateUtils.getOpponent(state, player));
      });
    }
    return state;
  }
}
