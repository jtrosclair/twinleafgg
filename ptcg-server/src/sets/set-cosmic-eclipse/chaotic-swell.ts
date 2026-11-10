import { GameLog, StateUtils } from '../../game';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { PlayStadiumEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class ChaoticSwell extends TrainerCard {

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '187';
  
  public trainerType = TrainerType.STADIUM;

  public set = 'CEC';

  public name = 'Chaotic Swell';

  public fullName = 'Chaotic Swell CEC';
  
  public  text = 'Whenever either player plays a Stadium card from their hand, discard that Stadium card after discarding this one. (The new Stadium card has no effect.)';
    
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      if (effect.trainerCard.tags.includes(CardTag.DUAL_STADIUM)) {
        const other = player.hand.cards.find(card => card !== effect.trainerCard
          && card.name === effect.trainerCard.name && card.set === effect.trainerCard.set
          && card.tags.includes(CardTag.DUAL_STADIUM) && card.setNumber !== effect.trainerCard.setNumber);
        if (other) player.hand.moveCardTo(other, player.discard);
      }
      player.hand.moveCardTo(effect.trainerCard, player.discard);
      
      store.log(state, GameLog.LOG_DISCARD_STADIUM_CHAOTIC_SWELL, { name: player.name, card: effect.trainerCard.name });
    }
    
    return state;
  }

}
