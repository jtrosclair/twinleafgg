import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameMessage, PlayerType, SlotType, GameError, CardTarget, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { RemoveSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { CheckHpEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { ATTACH_ENERGY_TRANSFERS, IS_ABILITY_BLOCKED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Gardevoirex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Kirlia';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = P;
  public hp: number = 310;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Psychic Embrace',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn, you may attach a Basic [P] Energy card from your discard pile to 1 of your [P] Pokémon. If you attached Energy to a Pokémon in this way, put 2 damage counters on that Pokémon. You can\'t use this Ability on a Pokémon that would be Knocked Out.'
  }];

  public attacks = [
    {
      name: 'Miracle Force',
      cost: [P, P, C],
      damage: 190,
      text: 'This Pokémon recovers from all Special Conditions.'
    }
  ];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public setNumber: string = '86';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gardevoir ex';
  public fullName: string = 'Gardevoir ex SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const { player, power } = effect;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      const eligibleEnergy = player.discard.cards.some(card => card instanceof EnergyCard
        && card.energyType === EnergyType.BASIC && card.provides.includes(CardType.PSYCHIC));
      if (!eligibleEnergy) throw new GameError(GameMessage.CANNOT_USE_POWER);

      const blockedTo: CardTarget[] = [];
      const maxPerTarget: { target: CardTarget; max: number }[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, _card, target) => {
        const type = new CheckPokemonTypeEffect(slot);
        store.reduceEffect(state, type);
        const hp = new CheckHpEffect(player, slot);
        store.reduceEffect(state, hp);
        const max = Math.floor((hp.hp - slot.damage - 1) / 20);
        if (!type.cardTypes.includes(CardType.PSYCHIC) || max <= 0) {
          blockedTo.push(target);
        } else {
          maxPerTarget.push({ target, max });
        }
      });
      if (maxPerTarget.length === 0) throw new GameError(GameMessage.CANNOT_USE_POWER);

      // Ref: set-stellar-crown/lapras-ex.ts (attach selected Energy through the engine).
      return store.prompt(state, new AttachEnergyPrompt(
        player.id, GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE], { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: true, min: 0, validCardTypes: [CardType.PSYCHIC], blockedTo, maxPerTarget },
      ), transfers => {
        ATTACH_ENERGY_TRANSFERS(store, state, player, transfers ?? [], 'discard', {
          sourceCard: this,
          onAttached: attached => {
            for (const { to } of attached) {
              const slot = StateUtils.getTarget(state, player, to);
              state = store.reduceEffect(state, new PlaceDamageCountersEffect(player, slot, 20, this, power));
            }
          },
        });
      });
    }

    return Gardevoirex.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const removeSpecialCondition = new RemoveSpecialConditionsEffect(effect, undefined);
      removeSpecialCondition.target = player.active;
      state = store.reduceEffect(state, removeSpecialCondition);
      return state;
    }
    return state;
  }
}