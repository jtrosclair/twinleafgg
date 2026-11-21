import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, SlotType } from '../../game';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { Effect } from '../../game/store/effects/effect';
import { ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Raikouex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = L;
  public hp: number = 200;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
      name: 'Thunder-Clad',
      cost: [L],
      damage: 0,
      canUseOnFirstTurn: true,
      text: 'If you go first, you can use this attack during your first turn. Search your deck for an Energy card and attach it to this Pokémon. Then, shuffle your deck.',
    },
    {
      name: 'Power Rush',
      cost: [L, L, C],
      damage: 200,
      text: "Flip a coin. If tails, during your next turn, this Pokémon can't use attacks.",
    }];

  public regulationMark: string = 'J';

  public set: string = 'DLR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Raikou ex';
  public fullName: string = 'Raikou ex M6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const { player, source } = effect;
      return ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON(store, state, player, 1, 1, {
        destinationSlots: [source === player.active ? SlotType.ACTIVE : SlotType.BENCH],
        targetFilter: slot => slot === source,
        sourceCard: source.getPokemonCard() ?? this,
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      afterAttackDamage(state, effect, (store, next) =>
        COIN_FLIP_PROMPT(store, next, effect.player, heads => {
          if (!heads) effect.source.cannotAttackNextTurnPending = true;
        }));
    }

    return state;
  }
}
