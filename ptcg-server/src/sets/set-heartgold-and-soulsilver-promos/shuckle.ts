import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, PlayerType, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { queuePokemonEnergyReaction } from '../../game/store/prefabs/hand-energy-reactions';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Shuckle extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 60;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Fermenting Liquid',
    powerType: PowerType.POKEBODY,
    text: 'Whenever you attach an Energy card from your hand to Shuckle, ' +
      'draw a card.'
  }];

  public attacks = [
    {
      name: 'Shell Stunner',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 20,
      text: 'Flip a coin. If heads, prevent all damage done to Shuckle by ' +
        'attacks during your opponent\'s next turn.'
    }
  ];

  public set: string = 'HSP';

  public name: string = 'Shuckle';

  public fullName: string = 'Shuckle HSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '15';

  public readonly SHELL_STUNNER_MAREKER = 'SHELL_STUNNER_MAREKER';

  public readonly CLEAR_SHELL_STUNNER_MAREKER = 'CLEAR_SHELL_STUNNER_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.target.getPokemonCard() === this) {
      queuePokemonEnergyReaction(store, state, effect, this, () => {
        effect.player.deck.moveTo(effect.player.hand, 1);
      });
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.SHELL_STUNNER_MAREKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      state = store.prompt(state, new CoinFlipPrompt(
        player.id,
        GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          player.active.marker.addMarker(this.SHELL_STUNNER_MAREKER, this);
          opponent.marker.addMarker(this.CLEAR_SHELL_STUNNER_MAREKER, this);
        }
      });

      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_SHELL_STUNNER_MAREKER, this)) {

      effect.player.marker.removeMarker(this.CLEAR_SHELL_STUNNER_MAREKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.SHELL_STUNNER_MAREKER, this);
      });
    }

    return state;
  }

}
