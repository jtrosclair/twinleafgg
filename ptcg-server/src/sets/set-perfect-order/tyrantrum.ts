import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { flipLegacyCoinsUntilTails } from '../../game/store/prefabs/attack-coin-reflip';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameLog, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Tyrantrum extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Tyrunt';
  public cardType: CardType = F;
  public hp: number = 180;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Tyrannoguts',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon has any Special Energy attached, it gets +150 HP.'
  }];

  public attacks = [{
    name: 'Wreak Havoc',
    cost: [F, C],
    damage: 160,
    text: 'Flip a coin until you get tails. For each heads, discard the top card of your opponent\'s deck.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public usSetNumber = 'POR 45';
  public name: string = 'Tyrantrum';
  public fullName: string = 'Tyrantrum M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: +150 HP if has Special Energy
    if (effect instanceof CheckHpEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const checkEnergy = new CheckProvidedEnergyEffect(player, effect.target);
      store.reduceEffect(state, checkEnergy);

      if (IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      const hasSpecialEnergy = checkEnergy.energyMap.some(em => {
        const card = em.card;
        return card.superType === SuperType.ENERGY && card.energyType === EnergyType.SPECIAL;
      });

      if (hasSpecialEnergy) {
        effect.hp += 150;
      }
    }

    // Ref: set-stormfront/gyarados.ts (Wreak Havoc).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return flipLegacyCoinsUntilTails(store, state, effect.player, heads => {
        if (heads === 0) return;
        afterAttackDamage(state, effect, (store, state) => {
          const opponent = effect.opponent;
          const cards = opponent.deck.cards.slice(0, heads);
          state = MOVE_CARDS(store, state, opponent.deck, opponent.discard,
            { cards, sourceCard: this, sourceEffect: effect.attack });
          for (const card of cards) {
            if (opponent.discard.cards.includes(card)) {
              store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: opponent.name, card: card.name, effectName: effect.attack.name });
            }
          }
          return state;
        });
      });
    }

    return state;
  }
}
