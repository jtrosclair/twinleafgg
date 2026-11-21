import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameError, GameMessage } from '../../game';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { hasUsedPokemonAbility, recordPokemonAbilityUse } from '../../game/store/prefabs/in-play-ability-use';
import { DRAW_CARDS, IS_ABILITY_BLOCKED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';


export class Dodrio extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Doduo';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 100;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Zooming Draw',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put 1 damage counter on this Pokémon. If you do, draw a card.'
  }];

  public attacks = [
    {
      name: 'Balliastic Beak',
      cost: [CardType.COLORLESS],
      damage: 10,
      damageCalculation: '+',
      text: 'This attack does 30 more damage for each damage counter on this Pokémon.'
    }
  ];

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '85';

  public name: string = 'Dodrio';

  public fullName: string = 'Dodrio MEW';

  public readonly ZOOMING_DRAW_MARKER = 'ZOOMING_DRAW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect || (effect instanceof PlayPokemonEffect && effect.pokemonCard === this)) {
      effect.player.marker.removeMarker(this.ZOOMING_DRAW_MARKER, this);
    }

    // Ref: set-twilight-masquerade/munkidori.ts (attribute counters to the Ability).
    if (WAS_POWER_USED(effect, 0, this)) {
      const { player, power } = effect;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      const slot = player.getPokemonInPlay().find(candidate => candidate.getPokemonCard() === this);
      if (!slot) throw new GameError(GameMessage.CANNOT_USE_POWER);
      if (hasUsedPokemonAbility(player, this.ZOOMING_DRAW_MARKER, this, power.name)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const placement = new PlaceDamageCountersEffect(player, slot, 10, this, power);
      state = store.reduceEffect(state, placement);
      if (!placement.preventDefault && placement.target === slot) {
        DRAW_CARDS(player, 1);
      }
      recordPokemonAbilityUse(player, this.ZOOMING_DRAW_MARKER, this, power.name);
      slot.addBoardEffect(BoardEffect.ABILITY_USED);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage += Math.floor(effect.source.damage / 10) * 30;
    }
    return state;
  }
}
