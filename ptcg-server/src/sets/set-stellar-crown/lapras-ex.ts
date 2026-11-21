import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { AttachEnergyPrompt, CardList, CardTag, CardType, EnergyCard, GameMessage, PlayerType, PokemonCard, ShowCardsPrompt, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';

import { ATTACH_ENERGY_TRANSFERS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Laprasex extends PokemonCard implements CopiedAttackOwnershipContract {

  public cardType = CardType.WATER;

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public hp = 220;

  public stage = Stage.BASIC;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Power Splash',
      cost: [CardType.WATER],
      damage: 40,
      damageCalculation: 'x',
      text: 'This attack does 40 damage for each Energy attached to this Pokémon.'
    },
    {
      name: 'Larimar Rain',
      cost: [CardType.WATER, CardType.PSYCHIC, CardType.METAL],
      damage: 0,
      text: 'Look at the top 20 cards of your deck and attach any number of Energy cards you find there to your Pokémon in any way you like. Shuffle the other cards back into your deck.'
    }
  ];

  public regulationMark = 'H';

  public set: string = 'SCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '32';

  public name: string = 'Lapras ex';

  public fullName: string = 'Lapras ex SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return Laprasex.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {

    // Ref: set-surging-sparks/rotom.ts (counts the Energy supplied by the actual attacker).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const provided = new CheckProvidedEnergyEffect(effect.player, effect.source);
      state = store.reduceEffect(state, provided);
      const units = provided.energyMap.reduce((sum, entry) => sum + entry.provides.length, 0);
      const base = units * 40;
      effect.damage = base > 0 ? Math.max(0, effect.damage + base - effect.attack.damage) : 0;
    }

    // Ref: set-temporal-forces/metang.ts (look at the top cards, attach, then shuffle the remainder).
    if (WAS_ATTACK_USED(effect, 1, this)) {
      afterAttackDamage(state, effect, (store, afterState) => {
        const player = effect.player;
        if (player.deck.cards.length === 0) return afterState;
        const looked = new CardList();
        player.deck.moveTo(looked, Math.min(20, player.deck.cards.length));
        const energyCount = looked.cards.filter(card => card instanceof EnergyCard).length;
        const returnRemainder = () => {
          if (looked.cards.length === 0) return;
          looked.moveTo(player.deck);
          SHUFFLE_DECK(store, afterState, player);
        };

        if (energyCount === 0) {
          return store.prompt(afterState, new ShowCardsPrompt(
            player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, looked.cards.slice(),
          ), returnRemainder);
        }
        return store.prompt(afterState, new AttachEnergyPrompt(
          player.id, GameMessage.ATTACH_ENERGY_CARDS, looked, PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE], { superType: SuperType.ENERGY }, { min: 0, max: energyCount },
        ), transfers => {
          ATTACH_ENERGY_TRANSFERS(store, afterState, player, transfers ?? [], 'deck', {
            sourceList: looked,
            sourceCard: effect.source.getPokemonCard(),
            onAttached: returnRemainder,
          });
        });
      });
    }
    return state;
  }
}
