import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, EnergyType, SpecialCondition } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, EnergyCard, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect, AttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { checkBasicHandEnergyRecipients } from '../../game/store/prefabs/hand-energy-attachment';

import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class BlastoisePiplupGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public cardType: CardType = W;
  public hp: number = 270;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Splash Maker',
      cost: [W, W, C],
      damage: 150,
      text: 'You may attach up to 3 [W] Energy cards from your hand to your Pokémon in any way you like. If you do, heal 50 damage from those Pokémon for each card you attached to them in this way.'
    },
    {
      name: 'Bubble Launcher-GX',
      cost: [W, W, C],
      damage: 100,
      damageCalculation: '+',
      text: 'Your opponent\'s Active Pokémon is now Paralyzed. If this Pokémon has at least 3 extra [W] Energy attached to it (in addition to this attack\'s cost), this attack does 150 more damage. (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Blastoise & Piplup-GX';
  public fullName: string = 'Blastoise & Piplup-GX CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Splash Maker
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const energy = player.hand.cards.find((card): card is EnergyCard =>
        card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Water Energy');
      if (!energy) return state;

      afterAttackDamage(state, effect, (store, state) => {
        const slots = [SlotType.BENCH, SlotType.ACTIVE];
        const { hasRecipient, blockedTo } = checkBasicHandEnergyRecipients(store, state, player, energy, slots);
        if (!hasRecipient) return state;

        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.hand,
          PlayerType.BOTTOM_PLAYER,
          slots,
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
          { allowCancel: false, min: 0, max: 3, blockedTo }
        ), transfers => {
          const attachments = (transfers ?? []).map(({ card, to }) =>
            new AttachEnergyEffect(player, card as EnergyCard, StateUtils.getTarget(state, player, to)));
          store.reduceEffect(state, new AttachEnergyFromHandEffect(player, attachments, false, (attachedState, attached) => {
            for (const { target } of attached) {
              const healing = new HealTargetEffect(effect, 50);
              healing.target = target;
              store.reduceEffect(attachedState, healing);
            }
          }));
        });
      });
    }

    // Crimson Flame Pillar-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.addSpecialCondition(SpecialCondition.PARALYZED);

      // Check for the extra energy cost.
      const extraEffectCost: CardType[] = [W, W, W, W, W, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (!meetsExtraEffectCost) { return state; }  // If we don't have the extra energy, we just deal damage.

      effect.damage += 150;
    }

    return state;
  }
}
