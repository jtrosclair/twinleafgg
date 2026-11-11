import { Player, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckAttackCostEffect, CheckPokemonIntrinsicPowersEffect } from '../../game/store/effects/check-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

const PROTECTION = 'SIMISAGE_PAR_ARM_THRUST_NEEDLE_MARKER';
const CLEAR = 'SIMISAGE_PAR_CLEAR_ARM_THRUST_NEEDLE_MARKER';

function hasMonkeyTrio(player: Player): boolean {
  const names = new Set<string>();
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_slot, card) => names.add(card.name));
  return ['Simisage', 'Simisear', 'Simipour'].every(name => names.has(name));
}

class ArmThrustNeedleProtection extends EffectOfAttackEffect {
  readonly type = 'SIMISAGE_ARM_THRUST_NEEDLE_EFFECT';
  constructor(base: AttackEffect) { super(base); this.target = base.source; }
  applyEffect(): void {
    this.target.marker.addMarker(PROTECTION, this.markerSource, 'attack', 'pokemon');
    this.opponent.marker.addMarker(CLEAR, this.markerSource, 'attack', 'player');
  }
}

export class Simisage extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Pansage';
  public hp = 100;
  public cardType = CardType.GRASS;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];
  public powers = [{ name: 'Monkey Trio', powerType: PowerType.ABILITY,
    text: 'If you have Simisage, Simisear, and Simipour in play, ignore all [C] Energy in the costs of attacks used by this Pokémon.' }];
  public attacks = [{ name: 'Arm Thrust Needle', cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS], damage: 100,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Pokémon that have an Ability, except any Simisage.' }];
  public regulationMark = 'G';
  public set = 'PAR';
  public cardImage = 'assets/cardback.png';
  public setNumber = '5';
  public name = 'Simisage';
  public fullName = 'Simisage PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: upstream e315e91 (Monkey Trio). Permission applies only to the Ability.
    if (effect instanceof CheckAttackCostEffect && effect.player.active.getPokemonCard() === this
        && StateUtils.isPokemonInPlay(effect.player, this) && hasMonkeyTrio(effect.player)
        && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      effect.cost = effect.cost.filter(type => type !== CardType.COLORLESS);
    }
    return Simisage.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  /** Complete attack-owned lifecycle; no Monkey Trio permission is delegated. */
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    // Refs: Onix EVO (copy-owned protection), Hop's Phantump ASC (self target).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const protection = new ArmThrustNeedleProtection(effect);
      protection.markerSource = this;
      store.reduceEffect(state, protection);
    }

    if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect)
        && effect.target.getPokemonCard() === this && effect.target.marker.hasMarker(PROTECTION, this)) {
      // Use the attack's actual player, not an owner lookup on a possibly stale source slot.
      const defender = state.players.find(player => player.active === effect.target || player.bench.includes(effect.target));
      const attacker = effect.source.getPokemonCard();
      if (!defender || defender === effect.player || state.players[state.activePlayer] !== effect.player
          || !attacker || attacker.name === 'Simisage') return state;
      const powers = new CheckPokemonIntrinsicPowersEffect(effect.player, attacker);
      store.reduceEffect(state, powers);
      if (powers.powers.some(power => power.powerType === PowerType.ABILITY)) effect.preventDefault = true;
    }

    // Ref: Onix EVO (expiry after the opponent's turn; markers clear on switching).
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(CLEAR, this)) {
      effect.player.marker.removeMarker(CLEAR, this);
      StateUtils.getOpponent(state, effect.player).forEachPokemon(PlayerType.BOTTOM_PLAYER,
        slot => slot.marker.removeMarker(PROTECTION, this));
    }
    return state;
  }
}
