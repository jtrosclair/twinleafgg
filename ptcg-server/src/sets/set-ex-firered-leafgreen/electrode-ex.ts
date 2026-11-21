import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, StateUtils, GameError, GameMessage,
  PlayerType, SlotType,
  AttachEnergyPrompt,
  CardTarget,
  DiscardEnergyPrompt,
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EnergyCard } from '../../game/store/card/energy-card';
import { SelfKnockOutEffect } from '../../game/store/effects/game-effects';
import {
  ATTACH_ENERGY_TRANSFERS, BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEPOWER_BLOCKED,
  MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED,
} from '../../game/store/prefabs/prefabs';

export class Electrodeex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Voltorb';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Extra Energy Bomb',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    knocksOutSelf: true,
    text: 'Once during your turn (before your attack), you may discard Electrode ex and all the cards attached to it (this counts as Knocking Out Electrode ex). If you do, search your discard pile for 5 Energy cards and attach them to any of your Pokémon (excluding Pokémon-ex) in any way you like. This power can\'t be used if Electrode ex is affected by a Special Condition.'
  }];

  public attacks = [
    {
      name: 'Crash and Burn',
      cost: [L, C],
      damage: 30,
      damageCalculation: '+',
      text: 'You may discard as many Energy cards as you like attached to your Pokémon in play. If you do, this attack does 30 damage plus 20 more damage for each Energy you discarded.'
    }
  ];

  public set: string = 'RG';
  public name: string = 'Electrode ex';
  public fullName: string = 'Electrode ex RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-celestial-storm/electrode-gx.ts (Extra Energy Bomb). This print discards itself first.
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);

      return store.reduceEffect(state, new SelfKnockOutEffect(player, this, () => {
        const blockedTo: CardTarget[] = [];
        let hasRecipient = false;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_slot, card, target) => {
          if (card.tags.includes(CardTag.POKEMON_ex)) blockedTo.push(target);
          else hasRecipient = true;
        });
        const count = Math.min(5, player.discard.cards.filter(card => card instanceof EnergyCard).length);
        if (!hasRecipient || count === 0) return;

        store.prompt(state, new AttachEnergyPrompt(
          player.id, GameMessage.ATTACH_ENERGY_CARDS, player.discard,
          PlayerType.BOTTOM_PLAYER, [SlotType.BENCH, SlotType.ACTIVE], { superType: SuperType.ENERGY },
          { allowCancel: false, min: count, max: count, blockedTo },
        ), transfers => {
          ATTACH_ENERGY_TRANSFERS(store, state, player, transfers ?? [], 'discard', { sourceCard: this });
        });
      }));
    }

    // Ref: set-celestial-storm/electrode-gx.ts (Crush and Burn-GX).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const count = player.getPokemonInPlay().reduce((total, slot) =>
        total + slot.cards.filter(card => card instanceof EnergyCard).length, 0);
      if (count === 0) return state;

      return store.prompt(state, new DiscardEnergyPrompt(
        player.id, GameMessage.CHOOSE_ENERGIES_TO_DISCARD, PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH], { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: count },
      ), transfers => {
        for (const transfer of transfers ?? []) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          if (transfer.from.player !== PlayerType.BOTTOM_PLAYER || !source.cards.includes(transfer.card)) continue;
          MOVE_CARDS(store, state, source, player.discard, { cards: [transfer.card], sourceCard: this, sourceEffect: effect });
          if (!source.cards.includes(transfer.card)) effect.damage += 20;
        }
      });
    }
    return state;
  }
}
