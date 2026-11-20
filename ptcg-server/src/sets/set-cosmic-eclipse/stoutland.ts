import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { ChooseEnergyPrompt, ChoosePokemonPrompt, GameMessage, Player, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterEvolveEffect } from '../../game/store/effects/game-effects';
import { canUseKnockOutAbility, wasActiveWhenDamaged } from '../../game/store/prefabs/knock-out-effects';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { CONFIRMATION_PROMPT, DAMAGE_OPPONENT_POKEMON, IS_ABILITY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Stoutland extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 150;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Herdier';

  public powers = [{
    name: 'Arf Arf Bark',
    powerType: PowerType.ABILITY,
    text: ' When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may discard an Energy from your opponent\'s Active Pokémon. ' +
      'If this Pokémon is your Active Pokémon and is Knocked Out by damage from an opponent\'s attack, you may discard an Energy from your opponent\'s Active Pokémon.'
  }];

  public attacks = [{
    name: 'Overrun',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 110,
    text: ' This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) '
  }];

  public set = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '176';
  public name = 'Stoutland';
  public fullName = 'Stoutland CEC';

  private attachedEnergy(target: PokemonCardList) {
    return [...new Set([...target.cards.filter(card => card.superType === SuperType.ENERGY), ...target.energies.cards])];
  }

  private offerEnergyDiscard(store: StoreLike, state: State, player: Player): void {
    const opponent = StateUtils.getOpponent(state, player);
    const target = opponent.active;
    const energy = this.attachedEnergy(target);
    if (energy.length === 0) return;
    CONFIRMATION_PROMPT(store, state, player, confirmed => {
      if (!confirmed) return;
      const colorless = [CardType.COLORLESS];
      store.prompt(state, new ChooseEnergyPrompt(player.id, GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        energy.map(card => ({ card, provides: colorless, disableBlend: true })), colorless, { allowCancel: false }), selected => {
        const card = selected?.[0]?.card;
        if (card) {
          MOVE_CARDS(store, state, target, opponent.discard, { cards: [card], sourceCard: this, sourceEffect: this.powers[0] });
        }
      });
    });
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-silver-tempest/krookodile.ts (independent evolution and Knock Out triggers)
    if (effect instanceof AfterEvolveEffect && effect.pokemonCard === this && effect.playedFromHand
      && state.players[state.activePlayer] === effect.player
      && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      this.offerEnergyDiscard(store, state, effect.player);
    }

    if (canUseKnockOutAbility(store, state, effect, this) && effect.resolveBeforeDiscard && wasActiveWhenDamaged(effect)) {
      const { player } = effect;
      const opponent = StateUtils.getOpponent(state, player);
      effect.beforeDiscard.set(this, {
        label: this.powers[0].name,
        canResolve: () => this.attachedEnergy(opponent.active).length > 0,
        resolve: () => this.offerEnergyDiscard(store, state, player)
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 30, targets);
      });

      return state;
    }

    return state;
  }
}
