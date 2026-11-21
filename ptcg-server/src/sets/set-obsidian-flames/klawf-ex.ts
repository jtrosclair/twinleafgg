import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag, CardType, SuperType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED, MOVE_CARDS, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Klawfex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 220;

  public weakness = [ {type: CardType.GRASS} ];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [
    {
      name: 'Counterattacking Pincer',
      powerType: PowerType.ABILITY,
      text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), discard an Energy from the Attacking Pokémon.'
    }
  ];

  public attacks = [{
    name: 'Falling Press',
    cost: [ CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 100,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 80 more damage.'
  }];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '120';

  public name: string = 'Klawf ex';

  public fullName: string = 'Klawf ex OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-pokemon-151/hitmonchan.ts (retaliate against the original attacker after damage).
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })
      && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      const attacker = effect.source;
      const power = this.powers[0];
      if (attacker.cards.some(card => card.superType === SuperType.ENERGY)
        && !IS_ABILITY_BLOCKED(store, state, owner, this)
        && CAN_APPLY_ABILITY_TO_TARGET(store, state, owner, power, this, attacker)) {
        const discard = StateUtils.findOwner(state, attacker).discard;
        return store.prompt(state, new ChooseCardsPrompt(
          owner, GameMessage.CHOOSE_CARD_TO_DISCARD, attacker,
          { superType: SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false },
        ), cards => {
          return MOVE_CARDS(store, state, attacker, discard, { cards, sourceCard: this, sourceEffect: power });
        });
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 80);
    }
    return state;
  }
}
