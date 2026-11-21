import { AttachEnergyPrompt, CardTarget, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StoreLike } from '../../game';
import { CardTag, CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';

import { EnergyCard } from '../../game/store/card/energy-card';
import { SelfKnockOutEffect } from '../../game/store/effects/game-effects';
import { ATTACH_ENERGY_TRANSFERS, IS_ABILITY_BLOCKED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Milotic extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Feebas';

  public cardType: CardType = CardType.WATER;

  public hp: number = 100;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Energy Grace',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    knocksOutSelf: true,
    text: 'Once during your turn (before your attack), you may Knock Out this Pokémon. If you do, attach 3 basic Energy cards from your discard pile to 1 of your Pokémon (excluding Pokémon-EX).'
  }];

  public attacks = [
    {
      name: 'Waterfall',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: ''
    }
  ];

  public set: string = 'FLF';

  public name: string = 'Milotic';

  public fullName: string = 'Milotic FLF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '23';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-celestial-storm/electrode-gx.ts (Extra Energy Bomb).
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);

      const count = Math.min(3, player.discard.cards.filter(card =>
        card instanceof EnergyCard && card.energyType === EnergyType.BASIC).length);
      const blockedTo: CardTarget[] = [];
      let hasRecipient = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_slot, card, target) => {
        if (card.tags.includes(CardTag.POKEMON_EX)) blockedTo.push(target);
        else hasRecipient = true;
      });
      if (count === 0 || !hasRecipient) throw new GameError(GameMessage.CANNOT_USE_POWER);

      return store.prompt(state, new AttachEnergyPrompt(
        player.id, GameMessage.ATTACH_ENERGY_CARDS, player.discard,
        PlayerType.BOTTOM_PLAYER, [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: count, max: count, sameTarget: true, blockedTo },
      ), transfers => {
        ATTACH_ENERGY_TRANSFERS(store, state, player, transfers ?? [], 'discard', {
          sourceCard: this,
          onAttached: () => store.reduceEffect(state, new SelfKnockOutEffect(player, this)),
        });
      });
    }
    return state;
  }
}
