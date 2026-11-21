import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Bronzong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bronzor';
  public cardType: CardType = M;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Gentle Slap',
    cost: [M],
    damage: 40,
    text: '',
  },
  {
    name: 'Metal Block',
    cost: [M, M, C],
    damage: 120,
    text: 'During your opponent\'s next turn, this Pokémon takes 100 less damage from attacks from your opponent\'s Evolution Pokémon.',
  }];

  public set: string = 'PBL';
  public setNumber: string = '64';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bronzong';
  public fullName: string = 'Bronzong M5';

  public readonly METAL_BLOCK_MARKER = 'M5_BRONZONG_METALBLOCK';
  public readonly CLEAR_METAL_BLOCK_MARKER = 'M5_BRONZONG_CLEAR_METALBLOCK';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.source.damageReductionNextTurn = 100;
      effect.source.damageReductionNextTurnFilter = { sourceIsEvolution: true };
    }

    // Legacy saves stored this effect as a marker.
    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.METAL_BLOCK_MARKER, this)
      && StateUtils.isEvolutionPokemon(effect.source)) {
      if (effect.player !== StateUtils.findOwner(state, effect.target)) {
        effect.reduceDamageAfterWeakness(100, this.fullName);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_METAL_BLOCK_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_METAL_BLOCK_MARKER, this);
      const opp = StateUtils.getOpponent(state, effect.player);
      opp.forEachPokemon(PlayerType.TOP_PLAYER, cardList =>
        cardList.marker.removeMarker(this.METAL_BLOCK_MARKER, this)
      );
    }

    return state;
  }
}
