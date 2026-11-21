import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { Card, CardList, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DISCARD_ATTACK_ENERGY_COST } from '../../game/store/prefabs/costs';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Cacturne extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Cacnea';
  public hp: number = 90;
  public cardType: CardType = G;
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Spike Wound',
    cost: [C, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon that has any damage counters on it. This attack does 50 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }, {
    name: 'Poison Experiment',
    cost: [G, D],
    damage: 20,
    text: 'You may discard a Grass or Darkness Energy attached to Cacturne. If you discard a Grass Energy, the Defending Pokémon is now Poisoned. If you discard a Darkness Energy, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'PL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Cacturne';
  public fullName: string = 'Cacturne PL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Spike Wound
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasDamaged = opponent.active.damage > 0 || opponent.bench.some(b => b.cards.length > 0 && b.damage > 0);
      if (!hasDamaged) {
        return state;
      }

      const blocked: CardTarget[] = [];
      if (opponent.active.cards.length === 0 || opponent.active.damage === 0) {
        blocked.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 });
      }
      opponent.bench.forEach((b, index) => {
        if (b.cards.length === 0 || b.damage === 0) {
          blocked.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
        }
      });

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), selected => {
        const target = selected[0];
        if (target === opponent.active) {
          const damageEffect = new DealDamageEffect(effect, 50);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        } else {
          const damageEffect = new PutDamageEffect(effect, 50);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    // Poison Experiment
    if (AFTER_ATTACK(effect, 1, this) && effect.resolvedAttackEffect && effect.originalDefender === effect.opponent.active) {
      const attack = effect.resolvedAttackEffect;
      const query = new CheckProvidedEnergyEffect(attack.player, attack.source);
      state = store.reduceEffect(state, query);
      const eligible = new CardList();
      const types = new Map<Card, CardType[]>();
      query.energyMap.forEach(entry => {
        if (!attack.source.cards.includes(entry.card) && !attack.source.energies.cards.includes(entry.card)) return;
        const matching = [G, D].filter(type => StateUtils.checkEnoughEnergy([entry], [type]));
        if (matching.length !== 0) types.set(entry.card, matching);
      });
      eligible.cards = [...types.keys()];
      if (eligible.cards.length === 0) return state;

      return store.prompt(state, new ChooseCardsPrompt(
        effect.player, GameMessage.CHOOSE_ENERGY_TO_DISCARD, eligible, {},
        { min: 0, max: 1, allowCancel: true }
      ), selected => {
        const card = selected?.[0];
        const supplies = card && types.get(card);
        if (!card || !supplies) return;
        DISCARD_ATTACK_ENERGY_COST(store, state, attack, [card], attackState => {
          if (supplies.includes(G)) ADD_POISON_TO_PLAYER_ACTIVE(store, attackState, effect.opponent, effect);
          if (supplies.includes(D)) ADD_PARALYZED_TO_PLAYER_ACTIVE(store, attackState, effect.opponent, effect);
        });
      });
    }

    return state;
  }
}
