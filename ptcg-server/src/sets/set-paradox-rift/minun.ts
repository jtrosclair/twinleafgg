import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Minun extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 70;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Buddy Pulse',
    powerType: PowerType.ABILITY,
    text: 'If you have Plusle in play, whenever your opponent attaches an Energy card from their hand to 1 of their Pokémon, put 2 damage counters on that Pokémon. The effect of Buddy Pulse doesn\'t stack.'
  }];

  public attacks = [{
    name: 'Speed Ball',
    cost: [CardType.LIGHTNING],
    damage: 20,
    text: '',
  }];

  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Minun';
  public regulationMark: string = 'G';
  public fullName: string = 'Minun PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (!(effect instanceof AfterAttachEnergyFromHandEffect)) return state;
    const { player, target } = effect;
    if (!player.getPokemonInPlay().includes(target)) return state;

    const owner = StateUtils.getOpponent(state, player);
    const power = this.powers[0];
    const getSource = () => {
      const pokemon = owner.getPokemonInPlay().map(slot => slot.getPokemonCard());
      if (!pokemon.some(card => card?.name === 'Plusle')) return undefined;
      return pokemon.find(card => card instanceof Minun && !IS_ABILITY_BLOCKED(store, state, owner, card));
    };

    // Only one Buddy Pulse can apply to this physical Energy attachment.
    if (!effect.reactions.has(power.name) && getSource() === this) {
      effect.reactions.set(power.name, {
        label: power.name,
        canResolve: () => player.getPokemonInPlay().includes(target) && getSource() !== undefined,
        resolve: () => {
          const source = getSource();
          if (source) store.reduceEffect(state, new PlaceDamageCountersEffect(owner, target, 20, source, power));
        },
      });
    }

    return state;
  }
}
