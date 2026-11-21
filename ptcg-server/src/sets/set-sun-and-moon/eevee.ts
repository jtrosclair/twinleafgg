import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CoinFlipPrompt, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { queueBasicEnergyEvolution } from '../../game/store/prefabs/energy-evolution';

export class Eevee extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Energy Evolution',
    powerType: PowerType.ABILITY,
    text: 'When you attach a basic Energy card from your hand to this Pokémon during your turn, you may search your deck for a card that evolves from this Pokémon that is the same type as that Energy card and put it onto this Pokémon to evolve it. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Quick Draw',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Flip a coin. If heads, draw a card.'
  }];

  public set: string = 'SUM';

  public setNumber = '101';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Eevee';

  public fullName: string = 'Eevee SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterAttachEnergyFromHandEffect && state.players[state.activePlayer] === effect.player) {
      queueBasicEnergyEvolution(store, state, effect, this);
    }
    return Eevee.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {

    // quick draw
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          player.deck.moveTo(player.hand, 1);
        }
      });
    }

    return state;
  }

}
