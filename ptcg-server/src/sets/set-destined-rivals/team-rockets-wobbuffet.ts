import { CardTag, CardType, Stage, PokemonCard, State, StoreLike, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { moveBenchedDamageCountersToDefender } from '../../game/store/prefabs/damage-counter-movement';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsWobbuffet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = P;
  public hp: number = 110;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Rocket Mirror',
      cost: [P, C],
      damage: 0,
      text: 'Move all damage counters from 1 of your Benched Team Rocket\'s Pokemon to your opponent\'s Active Pokemon.'
    },
    {
      name: 'Jet Headbutt',
      cost: [P, C, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'DRI';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Team Rocket\'s Wobbuffet';
  public fullName: string = 'Team Rocket\'s Wobbuffet DRI';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-twilight-masquerade/munkidori.ts (separate removal from counter placement).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      moveBenchedDamageCountersToDefender(state, effect, GameMessage.CHOOSE_POKEMON_TO_DAMAGE, slot => slot.getPokemonCard()?.tags.includes(CardTag.TEAM_ROCKET) === true);
    }
    return state;
  }
}
