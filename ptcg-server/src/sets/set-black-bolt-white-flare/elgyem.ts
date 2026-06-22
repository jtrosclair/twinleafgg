import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { CardTransfer, EnergyCard, GameMessage, MoveEnergyPrompt, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Elgyem extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Slight Shift',
      cost: [P],
      damage: 0,
      text: 'Move an Energy from 1 of your opponent\'s Pokémon to another of their Pokémon.'
    },
    {
      name: 'Beam',
      cost: [C, C, C],
      damage: 40,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Elgyem';
  public fullName: string = 'Elgyem BLK';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Slight Shift
    // Ref: set-unbroken-bonds/tentacruel.ts (Wicked Tentacles)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let hasEnergy = false;
      let pokemonCount = 0;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        pokemonCount += 1;
        hasEnergy = hasEnergy || cardList.cards.some(c => c instanceof EnergyCard);
      });

      if (!hasEnergy || pokemonCount <= 1) {
        return state;
      }

      store.prompt(state, new MoveEnergyPrompt(
        player.id,
        GameMessage.MOVE_ENERGY_CARDS,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), result => {
        const transfers: CardTransfer[] = result || [];
        transfers.forEach(transfer => {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          source.moveCardTo(transfer.card, target);
        });
      });
    }

    return state;
  }
}
