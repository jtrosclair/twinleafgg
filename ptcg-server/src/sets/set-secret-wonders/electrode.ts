import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EnergyEffect } from '../../game/store/effects/play-card-effects';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED, WAS_KNOCKED_OUT_BY_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';

export class Electrode extends PokemonCard implements EnergyCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Voltorb';
  public hp: number = 80;
  public cardType: CardType = L;
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Energy Shift',
    powerType: PowerType.POKEPOWER,
    text: 'If Electrode would be Knocked Out by damage from an attack, you may use this power. Electrode isn\'t discarded. Instead, attach it as an Energy card to 1 of your Pokémon. While attached, this card is a Special Energy card and provides every type of Energy but provides only 1 Energy at a time. (Has no effect other than providing Energy.)'
  }];

  public attacks = [{
    name: 'Ion Blast',
    cost: [L, C],
    damage: 40,
    damageCalculation: '+',
    text: 'You may do 40 damage plus 60 more damage. If you do, Electrode does 100 damage to itself.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Electrode';
  public fullName: string = 'Electrode SW';

  public provides: CardType[] = [CardType.ANY];
  public blendedEnergies: CardType[] = [];
  public blendedEnergyCount: number = 1;
  public energyType = EnergyType.SPECIAL;
  public text: string = '';
  public isBlocked = false;
  public energyEffect: EnergyEffect | undefined;

  public isEnergyWhenAttached(): boolean { return true; }

  public clearAttachedEnergyForm(): void {
    this.superType = SuperType.POKEMON;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-evolutions/electrode.ts (attach the original card during the Knock Out).
    if (WAS_KNOCKED_OUT_BY_ATTACK_DAMAGE(state, effect) && effect.resolveBeforeDiscard
      && effect.target.getPokemonCard() === this) {
      const { player, target } = effect;
      const eligible = () => player.getPokemonInPlay().filter(slot =>
        slot !== target && !effect.simultaneousKnockOuts?.has(slot));
      if (!IS_POKEPOWER_BLOCKED(store, state, player, this) && eligible().length > 0) {
        effect.beforeDiscard.set(this, {
          label: this.powers[0].name,
          canResolve: () => target.getPokemonCard() === this && eligible().length > 0,
          resolve: () => {
            CONFIRMATION_PROMPT(store, state, player, accepted => {
              if (!accepted) return;
              const recipients = new Set(eligible());
              const blocked: CardTarget[] = [];
              player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, card, position) => {
                if (!recipients.has(slot)) blocked.push(position);
              });
              store.prompt(state, new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
                PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE, SlotType.BENCH], { allowCancel: false, blocked }), ([selected]) => {
                if (recipients.has(selected)) {
                  effect.energyAttachment = { card: this, target: selected, provides: [CardType.ANY], promoteBeforePrizes: true };
                }
              });
            });
          }
        });
      }
    }

    if (effect instanceof CheckProvidedEnergyEffect && this.superType === SuperType.ENERGY
      && effect.source.energies.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: this.provides.slice() });
    }

    // Ion Blast
    if (WAS_ATTACK_USED(effect, 0, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 60;
          recoilAfterAttack(state, effect, 100);
        }
      });
    }

    return state;
  }
}
