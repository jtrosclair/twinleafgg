import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, ChooseCardsPrompt, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Sylveon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.FAIRY;
  public hp: number = 90;
  public weakness = [{ type: CardType.METAL }];
  public resistance = [{ type: CardType.DARK, value: -20 }];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = 'Eevee';

  public attacks = [
    {
      name: 'Wink Wink',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Your opponent reveals their hand. You may discard a Supporter card you find there and use the effect of that card as the effect of this attack.'
    },
    {
      name: 'Magical Shot',
      cost: [CardType.FAIRY, CardType.COLORLESS],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'FLI';
  public name: string = 'Sylveon';
  public fullName: string = 'Sylveon FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '87';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wink Wink
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_COPY_EFFECT,
        opponent.hand,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { allowCancel: false, min: 0, max: 1 }
      ), cards => {
        if (cards === null || cards.length === 0) {
          return;
        }
        const trainerCard = cards[0] as TrainerCard;
        opponent.hand.moveCardsTo(cards, opponent.discard);
        const playTrainerEffect = new TrainerEffect(player, trainerCard);
        store.reduceEffect(state, playTrainerEffect);
      });
    }

    return state;
  }
}
