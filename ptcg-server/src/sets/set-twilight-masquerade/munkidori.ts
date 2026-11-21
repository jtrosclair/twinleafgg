import { PokemonCard, Stage, CardType, PowerType, DamageMap, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike, CardTarget, RemoveDamagePrompt, GameError, SpecialCondition, BoardEffect } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { hasUsedPokemonAbility, inheritLegacyPokemonAbilityUse, recordPokemonAbilityUse } from '../../game/store/prefabs/in-play-ability-use';
import { PokemonReplacedEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { canMoveDamageCounters, moveAbilityDamageCounters } from '../../game/store/prefabs/damage-counter-movement';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Munkidori extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 110;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Adrena-Brain',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon has any [D] Energy attached, you may move up to 3 damage counters from 1 of your Pokémon to 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Mind Bend',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: 60,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '95';

  public name: string = 'Munkidori';

  public fullName: string = 'Munkidori TWM';

  public readonly ADRENA_BRAIN_MARKER = 'ADRENA_BRAIN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    state = Munkidori.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.ADRENA_BRAIN_MARKER, this);
    }

    // Ref: set-chaos-rising/book-of-transformation.ts: the outgoing Pokémon's
    // effects pass to the replacement; the incoming card's old use does not.
    if (effect instanceof PokemonReplacedEffect
      && (effect.pokemonCard === this || (effect.previousPokemon === this && !(effect.pokemonCard instanceof Munkidori)))) {
      inheritLegacyPokemonAbilityUse(effect, this.ADRENA_BRAIN_MARKER, this.powers[0].name);
      if (effect.pokemonCard === this && effect.previousMarkers.some(marker => marker.name === this.ADRENA_BRAIN_MARKER)) {
        recordPokemonAbilityUse(effect.player, this.ADRENA_BRAIN_MARKER, this, this.powers[0].name);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.ADRENA_BRAIN_MARKER);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const maxAllowedDamage: DamageMap[] = [];
      const blockedFrom: CardTarget[] = [];
      const blockedTo: CardTarget[] = [];

      if (hasUsedPokemonAbility(player, this.ADRENA_BRAIN_MARKER, this, effect.power.name)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const ownSlots = player.getPokemonInPlay();
      const holder = ownSlots.find(slot => slot.getPokemonCard() === this);
      if (!holder || !ownSlots.some(slot => slot.damage >= 10) || !canMoveDamageCounters(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const energy = new CheckProvidedEnergyEffect(player, holder);
      state = store.reduceEffect(state, energy);
      if (!energy.energyMap.some(entry => entry.provides.includes(CardType.DARK) || entry.provides.includes(CardType.ANY))) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
        const hp = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, hp);
        maxAllowedDamage.push({ target, damage: hp.hp });
        blockedTo.push(target);
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (_slot, _card, target) => blockedFrom.push(target));

      // Ref: set-destined-rivals/team-rockets-wobbuffet.ts (remove counters before resolving placement).
      return store.prompt(state, new RemoveDamagePrompt(
        player.id, GameMessage.MOVE_DAMAGE, PlayerType.ANY, [SlotType.ACTIVE, SlotType.BENCH], maxAllowedDamage,
        { min: 1, max: 3, allowCancel: false, sameTarget: true, singleSourceTarget: true, blockedTo, blockedFrom }
      ), transfers => {
        if (!transfers?.length) return;
        const { from, to } = transfers[0];
        const source = StateUtils.getTarget(state, player, from);
        const target = StateUtils.getTarget(state, player, to);
        if (!player.getPokemonInPlay().includes(source) || !opponent.getPokemonInPlay().includes(target)) return;

        recordPokemonAbilityUse(player, this.ADRENA_BRAIN_MARKER, this, effect.power.name);
        holder.addBoardEffect(BoardEffect.ABILITY_USED);
        moveAbilityDamageCounters(store, state, effect, source, target, Math.min(3, transfers.length) * 10);
      });
    }
    return state;
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }

}
