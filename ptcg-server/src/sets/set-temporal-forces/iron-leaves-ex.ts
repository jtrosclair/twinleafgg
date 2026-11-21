import { queueBenchPlayAbility } from '../../game/store/prefabs/bench-play-reactions';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ConfirmPrompt, MoveEnergyPrompt, PlayerType, SlotType, StateUtils, PowerType, CardTarget } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterPlayBasicFromHandEffect } from '../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IronLeavesex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];
  public cardType: CardType = G;
  public hp: number = 220;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Rapid Vernier',
    powerType: PowerType.ABILITY,
    exemptFromInitialize: true,
    text: 'Once during your turn, when you play this Pokémon from your hand onto your Bench, you may switch this Pokémon with your Active Pokémon. If you do, you may move any number of Energy from your Benched Pokémon to this Pokémon.'
  }];

  public attacks = [{
    name: 'Prism Edge',
    cost: [G, G, C],
    damage: 180,
    text: 'During your next turn, this Pokémon can\'t attack.',
  }];

  public regulationMark = 'H';
  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Iron Leaves ex';
  public fullName: string = 'Iron Leaves ex TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterPlayBasicFromHandEffect && effect.pokemonCard === this) {
      const { player, target } = effect;
      queueBenchPlayAbility(store, state, effect, () => {
        store.prompt(state, new ConfirmPrompt(player.id, GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
          if (!wantToUse) return;
          player.switchPokemon(target, store, state);
          if (player.active !== target) return;

          const blockedFrom: CardTarget[] = [];
          const blockedTo: CardTarget[] = [];
          let hasEnergyOnBench = false;
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, _card, address) => {
            if (slot === target) blockedFrom.push(address);
            else {
              blockedTo.push(address);
              hasEnergyOnBench ||= MoveEnergyPrompt.sourceCards(slot).some(card =>
                card.superType === SuperType.ENERGY && MoveEnergyPrompt.isAttachedEnergy(slot, card));
            }
          });
          if (!hasEnergyOnBench) return;

          store.prompt(state, new MoveEnergyPrompt(
            player.id, GameMessage.MOVE_ENERGY_CARDS, PlayerType.BOTTOM_PLAYER, [SlotType.BENCH, SlotType.ACTIVE],
            { superType: SuperType.ENERGY }, { allowCancel: false, blockedFrom, blockedTo, validateTransfers: true },
          ), transfers => {
            for (const transfer of transfers || []) {
              const source = StateUtils.getTarget(state, player, transfer.from);
              source.moveCardTo(transfer.card, target);
            }
          });
        });
      });
    }

    return IronLeavesex.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Prism Edge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }
    
    return state;
  }
}
