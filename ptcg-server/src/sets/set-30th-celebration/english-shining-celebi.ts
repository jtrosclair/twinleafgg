import { PokemonCard, Stage, CardType, StoreLike, State, SpecialCondition, ChoosePokemonPrompt, PlayerType, SlotType, GameMessage, SelectPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

// Printed text: https://limitlesstcg.com/cards/30C/CC6 (Neo Destiny 106).
export class EnglishShiningCelebiCC6 extends PokemonCard {
  public stage = Stage.BASIC;
  public hp = 50;
  public cardType = CardType.GRASS;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];
  public set = '30C';
  public setNumber = 'CC6';
  public usSetNumber = '30C CC6';
  public name = 'Shining Celebi';
  public fullName = 'Shining Celebi 30C CC6';
  public cardImage = 'assets/cardback.png';
  public attacks = [{
    name: 'Healing Water', cost: [CardType.WATER], damage: 0,
    text: 'Remove a number of damage counters from 1 of your Benched Pokémon equal to the number of Water Energy cards attached to Shining Celebi. If the Pokémon has fewer damage counters than that, remove all of them.'
  }, {
    name: 'Miracle Leaf', cost: [CardType.GRASS, CardType.PSYCHIC], damage: 10,
    text: 'Flip a number of coins equal to the number of Energy attached to the Defending Pokémon. If you get 1 or more heads, the Defending Pokémon is now Asleep, Confused, or Poisoned (your choice).'
  }];
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const energy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, energy);
      const waterCards = new Set(energy.energyMap.filter(e => e.provides.includes(CardType.WATER) || e.provides.includes(CardType.ANY)).map(e => e.card)).size;
      if (waterCards === 0 || !player.bench.some(b => b.cards.length > 0)) { return state; }
      return store.prompt(state, new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER, [SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
        if (selected && selected.length > 0) { store.reduceEffect(state, new HealEffect(player, selected[0], waterCards * 10)); }
      });
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const energy = new CheckProvidedEnergyEffect(effect.opponent, effect.opponent.active);
      store.reduceEffect(state, energy);
      const count = energy.energyMap.reduce((n, e) => n + e.provides.length, 0);
      if (count === 0) { return state; }
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, count, results => {
        if (!results.some(Boolean)) { return; }
        store.prompt(state, new SelectPrompt(effect.player.id, GameMessage.CHOOSE_OPTION,
          ['Asleep', 'Confused', 'Poisoned'], { allowCancel: false }), choice => {
          const condition = [SpecialCondition.ASLEEP, SpecialCondition.CONFUSED, SpecialCondition.POISONED][choice];
          store.reduceEffect(state, new AddSpecialConditionsEffect(effect, [condition]));
        });
      });
    }
    return state;
  }
}
