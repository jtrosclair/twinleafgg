import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameMessage, PlayerType, SlotType, GameError, AttachEnergyPrompt, CardTarget } from '../../game';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { SelfKnockOutEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

import { ATTACH_ENERGY_TRANSFERS, IS_ABILITY_BLOCKED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Magneton extends PokemonCard {

  public regulationMark = 'H';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Magnemite';
  public cardType: CardType = L;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Overvolt Discharge',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    knocksOutSelf: true,
    text: 'Once during your turn, you may attach up to 3 Basic Energy cards from your discard pile to your [L] Pokémon in any way you like. If you use this Ability, this Pokémon is Knocked Out.'
  }];

  public attacks = [
    {
      name: 'Electric Ball',
      cost: [L, C],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'SSP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Magneton';
  public fullName: string = 'Magneton SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      const energyCount = player.discard.cards.filter(card =>
        card instanceof EnergyCard && card.energyType === EnergyType.BASIC).length;
      const blockedTargets: CardTarget[] = [];
      let hasRecipient = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, _card, target) => {
        const type = new CheckPokemonTypeEffect(slot);
        store.reduceEffect(state, type);
        if (type.cardTypes.includes(CardType.LIGHTNING)) hasRecipient = true;
        else blockedTargets.push(target);
      });
      if (energyCount === 0 || !hasRecipient) throw new GameError(GameMessage.CANNOT_USE_POWER);

      // Ref: set-silver-tempest/archeops.ts (Primal Turbo)
      return store.prompt(state, new AttachEnergyPrompt(
        player.id, GameMessage.ATTACH_ENERGY_CARDS, player.discard,
        PlayerType.BOTTOM_PLAYER, [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: true, min: 1, max: Math.min(3, energyCount), blockedTo: blockedTargets },
      ), transfers => {
        if (!transfers?.length) return;
        ATTACH_ENERGY_TRANSFERS(store, state, player, transfers, 'discard', {
          sourceCard: this,
          onAttached: () => { store.reduceEffect(state, new SelfKnockOutEffect(player, this)); },
        });
      });
    }
    return state;
  }
}