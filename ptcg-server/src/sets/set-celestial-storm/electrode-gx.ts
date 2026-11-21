import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameMessage, PlayerType, SlotType, GameError, AttachEnergyPrompt, StateUtils, CardTarget } from '../../game';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { SelfKnockOutEffect } from '../../game/store/effects/game-effects';

import { DiscardEnergyPrompt } from '../../game/store/prompts/discard-energy-prompt';
import { ATTACH_ENERGY_TRANSFERS, BLOCK_IF_GX_ATTACK_USED, IS_ABILITY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class ElectrodeGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Voltorb';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 190;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Extra Energy Bomb',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    knocksOutSelf: true,
    text: 'Once during your turn (before your attack), you may attach 5 Energy cards from your discard pile to your Pokémon, except Pokémon-GX or Pokémon-EX, in any way you like. If you do, this Pokémon is Knocked Out.'
  }];

  public attacks = [
    {
      name: 'Electro Ball',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 50,
      text: ''
    },
    {
      name: 'Crash and Burn-GX',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 30,
      damageCalculation: '+',
      gxAttack: true,
      text: 'Discard any amount of Energy from your Pokémon. This attack does 50 more damage for each card you discarded in this way. (You can\'t use more than 1 GX attack in a game.) '
    },
  ];

  public set: string = 'CES';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '48';

  public name: string = 'Electrode-GX';

  public fullName: string = 'Electrode-GX CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      const energyCount = Math.min(5, player.discard.cards.filter(card => card instanceof EnergyCard).length);
      const blockedTargets: CardTarget[] = [];
      let hasRecipient = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_slot, card, target) => {
        if (card.tags.includes(CardTag.POKEMON_GX) || card.tags.includes(CardTag.POKEMON_EX)) {
          blockedTargets.push(target);
        } else {
          hasRecipient = true;
        }
      });
      if (energyCount === 0 || !hasRecipient) throw new GameError(GameMessage.CANNOT_USE_POWER);

      // Ref: set-silver-tempest/archeops.ts (Primal Turbo)
      return store.prompt(state, new AttachEnergyPrompt(
        player.id, GameMessage.ATTACH_ENERGY_CARDS, player.discard,
        PlayerType.BOTTOM_PLAYER, [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: energyCount, max: energyCount, blockedTo: blockedTargets },
      ), transfers => {
        ATTACH_ENERGY_TRANSFERS(store, state, player, transfers ?? [], 'discard', {
          sourceCard: this,
          onAttached: attached => {
            if (attached.length > 0) store.reduceEffect(state, new SelfKnockOutEffect(player, this));
          },
        });
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);

      player.usedGX = true;
      const energyCount = player.getPokemonInPlay().reduce((count, slot) =>
        count + slot.cards.filter(card => card instanceof EnergyCard).length, 0);
      if (energyCount === 0) return state;

      return store.prompt(state, new DiscardEnergyPrompt(
        player.id, GameMessage.CHOOSE_ENERGIES_TO_DISCARD, PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH], { superType: SuperType.ENERGY },
        { min: 0, max: energyCount, allowCancel: false },
      ), transfers => {
        for (const transfer of transfers ?? []) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          if (transfer.from.player !== PlayerType.BOTTOM_PLAYER || !source.cards.includes(transfer.card)) continue;
          MOVE_CARDS(store, state, source, player.discard, { cards: [transfer.card], sourceCard: this, sourceEffect: effect });
          if (!source.cards.includes(transfer.card)) effect.damage += 50;
        }
      });
    }

    return state;
  }
}