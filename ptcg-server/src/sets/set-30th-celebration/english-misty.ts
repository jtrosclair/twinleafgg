import { TrainerCard, TrainerType, StoreLike, State, ChooseCardsPrompt, GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

// Printed English text: https://limitlesstcg.com/cards/30C/CC3 (Gym Heroes 18).
export class EnglishMistyCC3 extends TrainerCard {
  public trainerType = TrainerType.ITEM;
  public set = '30C';
  public setNumber = 'CC3';
  public usSetNumber = '30C CC3';
  public name = 'Misty';
  public fullName = 'Misty 30C CC3';
  public cardImage = 'assets/cardback.png';
  public readonly MISTY_MARKER = 'MISTY_30C_DAMAGE';
  public text = "Discard 2 of the other cards in your hand in order to play this card. If this turn's attack does damage to the Defending Pokémon (after applying Weakness and Resistance), and if the attacking Pokémon has Misty in its name, the attack does 20 more damage to the Defending Pokémon.";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const blocked = player.hand.cards.map((c, i) => c === this ? i : -1).filter(i => i >= 0);
      if (player.hand.cards.filter(c => c !== this).length < 2) { throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD); }
      return store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand, {}, { min: 2, max: 2, allowCancel: false, blocked }), selected => {
        if (!selected || selected.length !== 2) { return; }
        player.hand.moveCardsTo(selected, player.discard);
        player.marker.addMarker(this.MISTY_MARKER, this);
      });
    }
    if (effect instanceof PutDamageEffect && effect.damage > 0
      && effect.target === effect.opponent.active
      && effect.source.getPokemonCard()?.name.includes('Misty')
      && effect.player.marker.hasMarker(this.MISTY_MARKER, this)) {
      // PutDamage is emitted after Weakness and Resistance, not before them.
      effect.damage += 20;
    }
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.MISTY_MARKER, this);
    }
    return state;
  }
}
