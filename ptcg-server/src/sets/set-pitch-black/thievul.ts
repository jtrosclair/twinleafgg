import { GameMessage, State, StoreLike } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { copyAttackFromPokemonList } from '../../game/store/prefabs/copy-attack-prefabs';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Thievul extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Nickit';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Skill Thief',
    cost: [C, C],
    damage: 0,
    text: 'If you have no cards in your hand, choose 1 of your opponent\'s Pokémon\'s attacks and use it as this attack.',
  },
  {
    name: 'Razor Fang',
    cost: [D, C, C],
    damage: 80,
    text: '',
  }];

  public set: string = "PBL";
  public setNumber: string = "54";
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Thievul';
  public fullName: string = 'Thievul M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const attackEffect = effect;
      const { player, opponent } = attackEffect;
      if (player.hand.cards.length > 0) {
        return state;
      }
      function* useSkillThief(next: () => void): IterableIterator<State> {
        let target = opponent.active;
        if (opponent.bench.some(slot => slot.getPokemonCard())) {
          yield store.prompt(state, new ChoosePokemonPrompt(
            player.id, GameMessage.CHOOSE_POKEMON, PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH], { min: 1, max: 1, allowCancel: false },
          ), selected => {
            if (selected?.[0]) target = selected[0];
            next();
          });
        }
        const pokemon = target.getPokemonCard();
        if (!pokemon) return state;
        return yield* copyAttackFromPokemonList(next, store, state, attackEffect, [pokemon], {
          allowCancel: false, preserveInPlaySource: true,
        });
      }
      const generator = useSkillThief(() => generator.next());
      return generator.next().value;
    }
    return state;
  }
}
