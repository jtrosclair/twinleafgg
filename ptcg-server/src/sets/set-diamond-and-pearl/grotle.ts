import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Grotle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Turtwig';
  public hp: number = 90;
  public cardType: CardType = G;
  public weakness = [{ type: R, value: 20 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Synthesis',
    cost: [G],
    damage: 0,
    text: 'Search your deck for a Grass Energy card and attach it to 1 of your Pokémon. Shuffle your deck afterward.'
  },
  {
    name: 'Cut',
    cost: [G, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Grotle';
  public fullName: string = 'Grotle DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Synthesis
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const blocked = player.deck.cards.map((card, index) =>
        card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Grass Energy' ? -1 : index
      ).filter(index => index >= 0);
      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { min: 0, max: 1, allowCancel: true, blocked }
      ), transfers => {
        if (transfers && (!Array.isArray(transfers) || transfers.length > 1)) {
          throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        for (const transfer of transfers || []) {
          if (!transfer || !(transfer.card instanceof EnergyCard)
            || transfer.card.energyType !== EnergyType.BASIC || transfer.card.name !== 'Grass Energy'
            || !player.deck.cards.includes(transfer.card)) {
            throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
          }
          const to = transfer.to;
          if (!to || to.player !== PlayerType.BOTTOM_PLAYER
            || (to.slot !== SlotType.ACTIVE && to.slot !== SlotType.BENCH)
            || !Number.isInteger(to.index) || to.index < 0
            || (to.slot === SlotType.ACTIVE && to.index !== 0)) {
            throw new GameError(GameMessage.INVALID_TARGET);
          }
          const target = StateUtils.getTarget(state, player, to);
          if (!target.getPokemonCard()) throw new GameError(GameMessage.INVALID_TARGET);
          state = MOVE_CARDS(store, state, player.deck, target, {
            cards: [transfer.card], sourceCard: this, sourceEffect: effect.attack
          });
        }
        state = SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
