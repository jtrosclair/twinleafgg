import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, SlotType, PlayerType, StateUtils, AttachEnergyPrompt, GameMessage, SuperType } from '../../game';
import { EnergyCard } from '../../game/store/card/energy-card';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Darkrai extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Shadow-Clad',
    cost: [D],
    damage: 0,
    text: 'Search your deck for up to 2 Basic [D] Energy cards and attach them to this Pokémon. Then, shuffle your deck.'
  },
  {
    name: 'Dark Cutter',
    cost: [D, D, C],
    damage: 110,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'DLR';
  public setNumber: string = '63';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Darkrai';
  public fullName: string = 'Darkrai MEZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shadow Cloak
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) return state;
      return store.prompt(state, new AttachEnergyPrompt(
        player.id, GameMessage.ATTACH_ENERGY_CARDS, player.deck, PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE], { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: false, sameTarget: true, validCardTypes: [CardType.DARK] },
      ), transfers => {
        const attached: EnergyCard[] = [];
        for (const transfer of transfers || []) {
          const energy = transfer.card as EnergyCard;
          MOVE_CARDS(store, state, player.deck, player.active, { cards: [energy], sourceCard: this, sourceEffect: effect.attack });
          if (player.active.cards.includes(energy)) attached.push(energy);
        }
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          for (const energy of attached) {
            if (player.active.cards.includes(energy)) store.reduceEffect(state, new AttachEnergyEffect(player, energy, player.active, 'deck'));
          }
        });
      });
    }

    return state;
  }
}
