import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, PowerType, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { AfterEvolveEffect, PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class TeamRocketsCrobatex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Team Rocket\'s Golbat';
  public tags = [CardTag.TEAM_ROCKET, CardTag.POKEMON_ex];
  public cardType: CardType = D;
  public hp: number = 310;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Bite About',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put 2 damage counters on 2 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Assassin\'s Return',
      cost: [D, D],
      damage: 120,
      text: 'You may put this Pokémon into your hand. (Discard all attached cards.)'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '122';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Crobat ex';
  public fullName: string = 'Team Rocket\'s Crobat ex DRI';

  public usedAssassinsReturn = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: upstream db4eebfcf (Bite About, optional preventable counters).
    if (effect instanceof AfterEvolveEffect && effect.pokemonCard === this && effect.playedFromHand
      && state.players[state.activePlayer] === effect.player) {
      const player = effect.player;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) return state;
      const availableTargets = StateUtils.getOpponent(state, player).getPokemonInPlay().length;
      const targetCount = Math.min(2, availableTargets);
      if (targetCount === 0) return state;

      return CONFIRMATION_PROMPT(store, state, player, useAbility => {
        if (!useAbility) return;

        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: targetCount, max: targetCount, allowCancel: false }
        ), selected => {
          for (const target of new Set(selected ?? [])) {
            store.reduceEffect(state, new PlaceDamageCountersEffect(player, target, 20, this, this.powers[0]));
          }
        });
      });
    }

    // Assassin's Return
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedAssassinsReturn = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedAssassinsReturn) {
      const player = effect.player;

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          const pokemons = player.active.getPokemons();
          const otherCards = player.active.cards.filter(card => !(card instanceof PokemonCard));
          player.active.clearEffects();

          // Move other cards to discard
          if (otherCards.length > 0) {
            MOVE_CARDS(store, state, player.active, player.discard, { cards: otherCards });
          }
          // Move Pokémon to hand
          if (pokemons.length > 0) {
            MOVE_CARDS(store, state, player.active, player.hand, { cards: pokemons });
          }
          this.usedAssassinsReturn = false;
        }
      });
    }
    return state;
  }
} 