import { KNOCK_OUT_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN } from '../../game/store/prefabs/attack-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DrawPrizesEffect } from '../../game/store/effects/game-effects';
import { takeBonusPrize } from '../../game/store/prefabs/prize-reactions';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, offerBenchedPrizePokemon } from '../../game/store/prefabs/prefabs';

export class JirachiPrismStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public tags: string[] = [CardTag.PRISM_STAR];

  public cardType: CardType = M;

  public hp: number = 80;

  public weakness = [{ type: R }];

  public resistance = [{ type: P, value: -20 }];

  public retreat = [C];

  public powers = [{
    name: 'Wish Upon a Star',
    powerType: PowerType.ABILITY,
    exemptFromAbilityLock: true,
    text: 'If you took this Pokémon as a face-down Prize card during your turn and your Bench isn\'t full, ' +
      'before you put it into your hand, you may put it onto your Bench and take 1 more Prize card.'
  }];

  public attacks = [
    {
      name: 'Perish Dream',
      cost: [C, C, C],
      damage: 10,
      text: 'This Pokémon is now Asleep. At the end of your opponent\'s next turn, the Defending Pokémon will be Knocked Out.'
    },
  ];

  public set: string = 'CES';

  public setNumber: string = '97';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Jirachi Prism Star';

  public fullName: string = 'Jirachi Prism Star CES';

  public readonly KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
  public readonly CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';

  // Keep the default for existing snapshots. Eligibility follows the physical Prize.
  public abilityUsed = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability
    if (effect instanceof DrawPrizesEffect) {
      offerBenchedPrizePokemon(store, state, effect, this, () => takeBonusPrize(store, state, effect));
    }

    // Attack
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.player, effect);
      KNOCK_OUT_DEFENDING_POKEMON_AT_END_OF_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(this.CLEAR_KNOCKOUT_MARKER, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.player.active.damage = 999;
      effect.player.active.marker.removeMarker(this.CLEAR_KNOCKOUT_MARKER, this);
      opponent.marker.removeMarker(this.KNOCKOUT_MARKER, this);
    }

    return state;
  }

}
