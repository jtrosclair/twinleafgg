import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, PlayerType, SlotType, ChoosePokemonPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerType } from '../../game/store/card/pokemon-types';

export class Yveltal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 130;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Fright Night',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is your Active Pokémon, each Pokémon Tool card in play has no effect.'
  }];

  public attacks = [{
    name: 'Pitch-Black Spear',
    cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: 'This attack does 60 damage to 1 of your opponent\'s Benched Pokémon-EX. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'BKT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name: string = 'Yveltal';
  public fullName: string = 'Yveltal BKT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fright Night ability - Tool cards have no effect
    // Note: The actual blocking logic would be implemented in the tool card effects
    // This ability just needs to be checked by tool cards when they try to activate

    // Pitch-Black Spear
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      // Count Pokemon-EX on bench and block non-EX Pokemon
      let exOnBench = 0;
      const blockedTo: { player: PlayerType; slot: SlotType; index: number }[] = [];
      opponent.bench.forEach((bench, index) => {
        if (bench.cards.length === 0) {
          return;
        }

        if (bench.getPokemonCard()?.tags.includes(CardTag.POKEMON_EX)) {
          exOnBench++;
        } else {
          const target = {
            player: PlayerType.TOP_PLAYER,
            slot: SlotType.BENCH,
            index
          };
          blockedTo.push(target);
        }
      });

      if (!exOnBench) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked: blockedTo }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }

        const target = targets[0];
        const damageEffect = new PutDamageEffect(effect, 60);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}
