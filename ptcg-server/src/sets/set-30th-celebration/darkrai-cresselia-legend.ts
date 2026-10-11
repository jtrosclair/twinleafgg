import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChooseEnergyPrompt, EnergyMap } from '../../game/store/prompts/choose-energy-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { DamageMap } from '../../game/store/prompts/move-damage-prompt';
import { MoonInviteDamagePrompt } from './moon-invite-damage-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';

// Probe both affected Pokemon before an atomic counter transfer; protection on
// either end must prevent the move, not create/remove counters.
class MoonInviteMoveEffect extends EffectOfAttackEffect {
  readonly type = 'MOON_INVITE_MOVE_EFFECT';
  applyEffect(): void {}
}

class LostCrisisEnergyPrompt extends ChooseEnergyPrompt {
  public validate(result: EnergyMap[] | null): boolean {
    return result !== null && result.every(e => this.energy.includes(e))
      && new Set(result.map(e => e.card)).size === result.length && super.validate(result);
  }
}

// Both physical halves expose the composite text, as do the existing LEGEND pairs.
// Only the top half is the in-play Pokemon after assembly (bottom, then top).
abstract class DarkraiCresseliaLegend extends PokemonCard {
  public abstract half: 'top' | 'bottom';
  public stage = Stage.LEGEND;
  public tags = [CardTag.LEGEND, CardTag.DUAL_LEGEND];
  public cardType = CardType.DARK;
  public additionalCardTypes = [CardType.PSYCHIC];
  public hp = 150;
  // Printed bottom-half artwork has BOTH Fighting and Psychic weakness.
  public weakness = [{ type: CardType.FIGHTING }, { type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public powers = [{
    name: 'Legend Assembly',
    text: 'Put this card from your hand onto your Bench only with the other half of Darkrai & Cresselia LEGEND.',
    exemptFromAbilityLock: true, useFromHand: true, powerType: PowerType.LEGEND_ASSEMBLY
  }];
  public attacks = [{
    name: 'Lost Crisis', cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS, CardType.COLORLESS], damage: 100,
    text: 'Choose 2 Energy attached to Darkrai & Cresselia LEGEND and put them in the Lost Zone. If any of your opponent\'s Pokémon would be Knocked Out by damage from this attack, put that Pokémon and all cards attached to it in the Lost Zone instead of discarding it.'
  }, {
    name: 'Moon\'s Invite', cost: [CardType.PSYCHIC], damage: 0,
    text: 'Move as many damage counters on your opponent\'s Pokémon as you like to any of your opponent\'s other Pokémon in any way you like.'
  }];
  public set = '30C';
  public name = 'Darkrai & Cresselia LEGEND';
  public cardImage = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.card === this && effect.power === this.powers[0]) {
      const player = effect.player;
      const slot = player.bench.find(b => b.cards.length === 0);
      const counterpart = player.hand.cards.find(c => c instanceof DarkraiCresseliaLegend && c.half !== this.half);
      if (!player.hand.cards.includes(this) || !slot || !counterpart) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const top = this.half === 'top' ? this : counterpart;
      const bottom = this.half === 'bottom' ? this : counterpart;
      player.hand.moveCardTo(bottom, slot);
      player.hand.moveCardTo(top, slot);
      slot.pokemonPlayedTurn = state.turn;
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const energy = new CheckProvidedEnergyEffect(effect.player, effect.source);
      store.reduceEffect(state, energy);
      const cost = [CardType.COLORLESS, CardType.COLORLESS];
      if (!StateUtils.checkEnoughEnergy(energy.energyMap, cost)) {
        throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
      }
      const damage = effect.damage;
      effect.damage = 0;
      const prompt = new LostCrisisEnergyPrompt(effect.player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD, energy.energyMap, cost, { allowCancel: false });
      return store.prompt(state, prompt, selected => {
        if (!prompt.validate(selected)) { throw new GameError(GameMessage.INVALID_PROMPT_RESULT); }
        const cards = Array.from(new Set(selected.map(e => e.card)));
        MOVE_CARDS(store, state, effect.source, effect.player.lostzone,
          { cards, sourceCard: this, sourceEffect: this.attacks[0] });
        if (!cards.every(c => effect.player.lostzone.cards.includes(c))) {
          throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        effect.damage = damage;
        effect.damageKnockOutsToLostZone = true;
      });
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const opponent = effect.opponent;
      const targets: DamageMap[] = [];
      let total = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (slot, card, target) => {
        total += slot.damage;
        targets.push({ target, damage: 0 });
      });
      if (targets.length < 2 || total === 0) { return state; }
      targets.forEach(t => t.damage = total);
      const prompt = new MoonInviteDamagePrompt(effect.player.id, GameMessage.MOVE_DAMAGE,
        PlayerType.TOP_PLAYER, [SlotType.ACTIVE, SlotType.BENCH], targets, { allowCancel: true });
      return store.prompt(state, prompt, transfers => {
        if (!prompt.validate(transfers, state)) { throw new GameError(GameMessage.INVALID_PROMPT_RESULT); }
        if (!transfers) { return; }
        for (const transfer of transfers) {
          const from = StateUtils.getTarget(state, effect.player, transfer.from);
          const to = StateUtils.getTarget(state, effect.player, transfer.to);
          const remove = new MoonInviteMoveEffect(effect); remove.target = from;
          const place = new MoonInviteMoveEffect(effect); place.target = to;
          store.reduceEffect(state, remove);
          store.reduceEffect(state, place);
          if (!remove.preventDefault && !place.preventDefault) {
            from.damage -= 10;
            to.damage += 10;
          }
        }
      });
    }
    return state;
  }
}

export class DarkraiCresseliaLegendTopCC16 extends DarkraiCresseliaLegend {
  public half: 'top' = 'top';
  public setNumber = 'CC16';
  public usSetNumber = '30C CC16';
  public fullName = 'Darkrai & Cresselia LEGEND (Top) 30C CC16';
}
export class DarkraiCresseliaLegendBottomCC17 extends DarkraiCresseliaLegend {
  public half: 'bottom' = 'bottom';
  public setNumber = 'CC17';
  public usSetNumber = '30C CC17';
  public fullName = 'Darkrai & Cresselia LEGEND (Bottom) 30C CC17';
}
