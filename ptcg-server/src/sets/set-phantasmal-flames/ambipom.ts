import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StateUtils, StoreLike, DiscardEnergyPrompt, GameMessage, PlayerType, SlotType, ChoosePokemonPrompt } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Ambipom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Aipom';
  public cardType: CardType = C;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Slap',
      cost: [C, C],
      damage: 50,
      text: ''
    },
    {
      name: 'Dual Tail',
      cost: [C, C, C],
      damage: 0,
      text: 'Discard 2 Energy from this Pokémon, and this attack does 60 damage to each of 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Ambipom';
  public fullName: string = 'Ambipom M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Dual Tail
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if this Pokémon has at least 2 energy attached
      const energyCount = player.active.cards.filter(card =>
        card.superType === SuperType.ENERGY
      ).length;

      if (energyCount >= 2) {
        state = store.prompt(state, new DiscardEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE],
          { superType: SuperType.ENERGY },
          { allowCancel: false, min: 2, max: 2 }
        ), transfers => {
          transfers = transfers || [];
          if (transfers.length === 0) {
            return state;
          }

          // Discard the energy
          for (const transfer of transfers) {
            const source = StateUtils.getTarget(state, player, transfer.from);
            source.moveCardTo(transfer.card, player.discard);
          }

          // Count available targets (active + benched Pokémon)
          const allTargets = [opponent.active, ...opponent.bench].filter(pokemon => pokemon.cards.length > 0);
          const targetCount = Math.min(2, allTargets.length);

          if (targetCount === 0) {
            return state;
          }

          // Prompt to choose 2 Pokémon to damage
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { allowCancel: false, min: targetCount, max: targetCount }
          ), targets => {
            targets.forEach(target => {
              const damageEffect = new PutDamageEffect(effect, 60);
              damageEffect.target = target;
              store.reduceEffect(state, damageEffect);
            });
          });
        });
      }
    }

    return state;
  }
}
