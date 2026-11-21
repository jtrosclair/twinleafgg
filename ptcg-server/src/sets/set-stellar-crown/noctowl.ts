import { PokemonCard, Stage, CardType, StoreLike, State, PowerType, SuperType, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED_FROM_HAND, SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../game/store/prefabs/prefabs';

export class Noctowl extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Hoothoot';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 100;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Jewel Seeker',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when you play this Pokémon from your hand to evolve 1 of your Pokémon, if you have any Tera Pokémon in play, you may search your deck for up to 2 Trainer cards, reveal them, and put them into your hand. Then, shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Speed Wing',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: ''
    }
  ];

  public regulationMark = 'H';

  public set: string = 'SCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '115';

  public name: string = 'Noctowl';

  public fullName: string = 'Noctowl SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-paldea-evolved/pelipper.ts (check the board after a completed hand evolution).
    if (!JUST_EVOLVED_FROM_HAND(effect, state, this)) return state;
    const player = effect.player;
    const hasTera = player.getPokemonInPlay().some(slot => slot.getPokemonCard()?.tags.includes(CardTag.POKEMON_TERA));
    if (!hasTera || player.deck.cards.length === 0 || IS_ABILITY_BLOCKED(store, state, player, this)) return state;

    return CONFIRMATION_PROMPT(store, state, player, confirmed => {
      if (confirmed) {
        SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.TRAINER },
          { min: 0, max: 2, allowCancel: false }, this.powers[0]);
      }
    });
  }

  /** Its printed attack has no additional effects; its Ability is not copied. */
  public reduceCopiedAttackEffect(_store: StoreLike, state: State, _effect: Effect): State {
    return state;
  }
}
