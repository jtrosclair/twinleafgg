import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GamePhase, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Minior extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Far-Flying Meteor',
    powerType: PowerType.ABILITY,
    text: 'During your turn, if this Pokémon is on your Bench, whenever you attach an Energy card from your hand to this Pokémon, you may switch it with your Active Pokémon.'
  }];

  public attacks = [{
    name: 'Gravitational Tackle',
    cost: [CardType.COLORLESS],
    damage: 20,
    damageCalculation: 'x',
    text: 'This attack does 20 damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
  }];

  public regulationMark = 'G';

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '99';

  public name: string = 'Minior';

  public fullName: string = 'Minior PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const retreat = new CheckRetreatCostEffect(StateUtils.getOpponent(state, effect.player));
      state = store.reduceEffect(state, retreat);
      effect.damage = retreat.cost.length * 20;
    }

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.target.getPokemonCard() === this
      && effect.activePokemonAtAttachment !== this) {
      const { player, target } = effect;
      const canResolve = () => state.players[state.activePlayer] === player
        && (state.phase === GamePhase.PLAYER_TURN || state.phase === GamePhase.ATTACK)
        && player.bench.includes(target) && target.getPokemonCard() === this
        && !IS_ABILITY_BLOCKED(store, state, player, this);
      if (canResolve()) {
        const label = this.powers[0].name;
        effect.reactions.set(label, {
          label,
          canResolve,
          resolve: () => {
            CONFIRMATION_PROMPT(store, state, player, wantToUse => {
              if (wantToUse && canResolve()) player.switchPokemon(target, store, state);
            });
          },
        });
      }
    }
    return state;
  }
}
