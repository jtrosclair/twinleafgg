import { CardType, PokemonCard, SpecialCondition, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Player } from '../../game/store/state/player';
import { MarkerItem } from '../../game/store/state/card-marker';

const PROTECTION = 'ARIADOS_DLR_PREVENT_BASIC_DAMAGE';
const CLEAR_PROTECTION = 'ARIADOS_DLR_CLEAR_PREVENT_BASIC_DAMAGE';

class PreventBasicDamageEffect extends EffectOfAttackEffect {
  readonly type = 'ARIADOS_DLR_PREVENT_BASIC_DAMAGE_EFFECT';
  constructor(base: AttackEffect) { super(base); this.target = base.source; }
  applyEffect(): void {
    this.source.marker.addMarker(PROTECTION, this.markerSource, 'attack', 'pokemon');
    this.opponent.marker.addMarker(CLEAR_PROTECTION, this.markerSource, 'attack', 'player');
  }
}

export class Ariados extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Spinarak';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Tormenting Poison',
    cost: [D],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.During Pokémon Checkup, place 4 damage counters on that Pokémon instead of 1.'
  },
  {
    name: 'Stealthy Sting',
    cost: [C, C, C],
    damage: 80,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'DLR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Ariados';
  public fullName: string = 'Ariados M6';

  public reducePlayerMarkerEffect(_store: StoreLike, state: State, effect: Effect, owner: Player, marker: MarkerItem): State {
    if (marker.name !== CLEAR_PROTECTION || marker.source !== this) return state;
    if (effect instanceof DealDamageEffect && effect.player === owner &&
        effect.target.marker.hasMarker(PROTECTION, this) && effect.source.getPokemonCard()?.stage === Stage.BASIC) {
      effect.preventDefault = true;
    }
    if (effect instanceof EndTurnEffect && effect.player === owner) {
      owner.marker.removeMarker(CLEAR_PROTECTION, this);
      for (const player of state.players) {
        for (const slot of [player.active, ...player.bench]) slot.marker.removeMarker(PROTECTION, this);
      }
    }
    return state;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Ariados.prototype.reduceAttack.call(this, store, state, effect, this);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _index: number, sourceCard?: PokemonCard): State {
    return Ariados.prototype.reduceAttack.call(this, store, state, effect, sourceCard || this);
  }

  private reduceAttack(store: StoreLike, state: State, effect: Effect, sourceCard: PokemonCard): State {
    // Sharp Poison
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const poison = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      poison.poisonDamage = 40;
      store.reduceEffect(state, poison);
    }

    // Covert Needle
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const protection = new PreventBasicDamageEffect(effect);
      protection.markerSource = sourceCard;
      return store.reduceEffect(state, protection);
    }

    return state;
  }
}