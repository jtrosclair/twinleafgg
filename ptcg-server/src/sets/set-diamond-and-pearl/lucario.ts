import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Lucario extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Riolu';
  public hp: number = 90;
  public cardType: CardType = F;
  public weakness = [{ type: P, value: 20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Feint',
    cost: [C],
    damage: 30,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  },
{
    name: 'Aura Sphere',
    cost: [F, F],
    damage: 40,
    text: 'Does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Lucario';
  public fullName: string = 'Lucario DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Feint
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreResistance = true;
    }

    // Aura Sphere
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      if (!opponent.bench.some(slot => slot.getPokemonCard())) return state;
      return store.prompt(state, new ChoosePokemonPrompt(
        effect.player.id, GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER, [SlotType.BENCH], { min: 1, max: 1, allowCancel: false }
      ), selected => {
        if (!Array.isArray(selected) || selected.length !== 1 ||
          !opponent.bench.includes(selected[0]) || !selected[0].getPokemonCard()) {
          throw new GameError(GameMessage.INVALID_TARGET);
        }
        const damage = new PutDamageEffect(effect, 20);
        damage.target = selected[0];
        store.reduceEffect(state, damage);
      });
    }

    return state;
  }
}
