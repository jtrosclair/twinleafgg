import { CardType, GamePhase, PokemonCard, PowerType, SpecialCondition, Stage, State, StateUtils, StoreLike } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { attachedEnergyProvides, queuePokemonEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { CONFIRMATION_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Roserade extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Roselia';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Energy Signal',
    useWhenInPlay: false,
    powerType: PowerType.POKEPOWER,
    text: 'When you attach a [G] Energy card or [P] Energy card from your hand to Roserade during your turn, you may use this power. If you attach a [G] Energy card, the Defending Pokémon is now Confused. If you attach a [P] Energy card, the Defending Pokémon is now Poisoned. This power can\'t be used if Roserade is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Power Blow',
    cost: [G, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Does 20 damage times the amount of Energy attached to Roserade.'
  }];

  public set: string = 'UL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Roserade';
  public fullName: string = 'Roserade UL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = player.active;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergy);

      const energyCount = checkProvidedEnergy.energyMap.length;
      effect.damage = 20 * energyCount;
    }

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.target.getPokemonCard() === this) {
      const { player, target } = effect;
      const canUse = () => state.players[state.activePlayer] === player
        && (state.phase === GamePhase.PLAYER_TURN || state.phase === GamePhase.ATTACK)
        && target.specialConditions.length === 0
        && attachedEnergyProvides(store, state, effect, CardType.GRASS, CardType.PSYCHIC);
      queuePokemonEnergyReaction(store, state, effect, this, () => {
        CONFIRMATION_PROMPT(store, state, player, accepted => {
          if (!accepted || !canUse()) return;
          const conditions: SpecialCondition[] = [];
          if (attachedEnergyProvides(store, state, effect, CardType.GRASS)) conditions.push(SpecialCondition.CONFUSED);
          if (attachedEnergyProvides(store, state, effect, CardType.PSYCHIC)) conditions.push(SpecialCondition.POISONED);
          const opponent = StateUtils.getOpponent(state, player);
          APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(store, state, player, this.powers[0], this, opponent.active, conditions);
        });
      }, canUse);
    }

    return state;
  }
}