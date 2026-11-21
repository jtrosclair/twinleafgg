import {
  AttachEnergyPrompt, CardList, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCard,
  PowerType, ShowCardsPrompt, SlotType, Stage, State, StoreLike, SuperType,
} from '../../game';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { SelfKnockOutEffect } from '../../game/store/effects/game-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import {
  ATTACH_ENERGY_TRANSFERS, BLOCK_IF_HAS_SPECIAL_CONDITION, DAMAGE_OPPONENT_POKEMON,
  IS_POKEPOWER_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED,
} from '../../game/store/prefabs/prefabs';

export class Electrode extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Voltorb';
  public cardType = L;
  public hp = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Energymite',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may use this power. If you do, Electrode is Knocked Out. Look at the top 7 cards of your deck. Choose as many Energy cards as you like and attach them to your Pokémon in any way you like. Discard the other cards. This power can\'t be used if Electrode is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Gigashock',
    cost: [L, C],
    damage: 30,
    text: 'Does 10 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'TM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Electrode';
  public fullName: string = 'Electrode TM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-paldea-evolved/forretress-ex.ts (Exploding Energy).
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);

      const lookedAt = new CardList();
      lookedAt.cards = player.deck.cards.slice(0, 7);
      const energyCount = lookedAt.cards.filter(card => card instanceof EnergyCard).length;
      const finish = () => {
        const remaining = lookedAt.cards.filter(card => player.deck.cards.includes(card));
        if (remaining.length) MOVE_CARDS(store, state, player.deck, player.discard, { cards: remaining, sourceCard: this });
        store.reduceEffect(state, new SelfKnockOutEffect(player, this));
      };
      if (lookedAt.cards.length === 0) {
        finish();
        return state;
      }
      if (energyCount === 0) {
        return store.prompt(state, new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_EFFECT,
          lookedAt.cards, { sourcePlayerId: player.id }), finish);
      }
      return store.prompt(state, new AttachEnergyPrompt(
        player.id, GameMessage.ATTACH_ENERGY_CARDS, lookedAt,
        PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE, SlotType.BENCH], { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: energyCount },
      ), transfers => {
        ATTACH_ENERGY_TRANSFERS(store, state, player, transfers ?? [], 'deck', {
          sourceCard: this,
          onAttached: finish,
        });
      });
    }
    // Ref: set-fossil/raichu.ts (Gigashock).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      afterAttackDamage(state, effect, (store, afterState) => {
        const benched = effect.opponent.bench.filter(slot => slot.getPokemonCard());
        if (benched.length <= 2) {
          DAMAGE_OPPONENT_POKEMON(store, afterState, effect, 10, benched);
          return afterState;
        }
        return store.prompt(afterState, new ChoosePokemonPrompt(
          effect.player.id, GameMessage.CHOOSE_POKEMON_TO_DAMAGE, PlayerType.TOP_PLAYER, [SlotType.BENCH],
          { allowCancel: false, min: 2, max: 2 },
        ), (targets: typeof benched | null) => {
          if (!targets || new Set(targets).size !== 2 || !targets.every(target => benched.includes(target))) {
            throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
          }
          DAMAGE_OPPONENT_POKEMON(store, afterState, effect, 10, targets);
        });
      });
    }
    return state;
  }
}
