import { CheckAttackCoinReflipEffect } from '../../game/store/effects/play-card-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, PlayerType, SlotType, GameMessage, StateUtils, AttachEnergyPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Victini2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers = [{
    name: 'Victory Star',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, after you flip any coins for an attack, you may ignore all effects of those coin flips and begin flipping those coins again. You can\'t use more than 1 Victory Star Ability each turn.'
  }];

  public attacks = [
    {
      name: 'Stored Power',
      cost: [R, C],
      damage: 30,
      text: 'Move all Energy attached to this Pokémon to 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '14';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Victini';
  public fullName: string = 'Victini NVI 14';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-darkness-ablaze/glimwood-tangle.ts (shared attack reflip choice).
    if (effect instanceof CheckAttackCoinReflipEffect && !effect.sources.has(this.powers[0].name)
      && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      effect.sources.set(this.powers[0].name, this);
    }

    // Attack: Stored Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      const attachedEnergies = player.active.cards.filter(card => {
        return card.superType === SuperType.ENERGY;
      });

      if (attachedEnergies.length === 0) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: attachedEnergies.length, max: attachedEnergies.length, sameTarget: true }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
    }

    return state;
  }
}
