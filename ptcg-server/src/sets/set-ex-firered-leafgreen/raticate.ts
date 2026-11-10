import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, GameError, GameMessage, PowerType, State, StoreLike, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Raticate extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Rattata';
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [];

  public powers = [{
    name: 'Thick Skin',
    powerType: PowerType.POKEBODY,
    text: 'Raticate can\'t be affected by any Special Conditions.'
  }];

  public attacks = [{
    name: 'Pickup',
    cost: [C],
    damage: 0,
    text: 'Search your discard pile for a Basic Pokémon (or Evolution card), a Trainer card, and an Energy card. Show them to your opponent and put them into your hand.'
  },
  {
    name: 'Quick Attack',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 10 damage plus 40 more damage.'
  }];

  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Raticate';
  public fullName: string = 'Raticate RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AddSpecialConditionsEffect && effect.target.getPokemonCard() === this) {
      effect.preventDefault = true;
    }
    return Raticate.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      // Capture the actual attacker and attack effect before copy delegation restores
      // its printed attacks. The discard search resolves after outgoing damage.
      const player = effect.player;
      const opponent = effect.opponent;
      const attacker = effect.source.getPokemonCard();
      afterAttackDamage(state, effect, (attackStore, attackState) => {
        const source = player.discard;
        const isPokemon = (card: Card) => card instanceof PokemonCard && [
          Stage.BASIC, Stage.STAGE_1, Stage.STAGE_2, Stage.VMAX, Stage.VSTAR, Stage.MEGA, Stage.BREAK
        ].includes(card.stage);
        const isTrainer = (card: Card) => card instanceof TrainerCard;
        const isEnergy = (card: Card) => card.superType === SuperType.ENERGY;
        const maxPokemons = Math.min(1, source.cards.filter(isPokemon).length);
        const maxTrainers = Math.min(1, source.cards.filter(isTrainer).length);
        const maxEnergies = Math.min(1, source.cards.filter(isEnergy).length);
        const count = maxPokemons + maxTrainers + maxEnergies;
        if (!count) return attackState;
        const blocked = source.cards.map((card, index) => isPokemon(card) || isTrainer(card) || isEnergy(card) ? -1 : index).filter(index => index >= 0);
        return attackStore.prompt(attackState, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_HAND, source, {},
          { min: count, max: count, allowCancel: false, blocked, maxPokemons, maxTrainers, maxEnergies }), selected => {
          if (!Array.isArray(selected) || selected.length !== count || new Set(selected).size !== count ||
            selected.some(card => !card || !source.cards.includes(card) || (!isPokemon(card) && !isTrainer(card) && !isEnergy(card))) ||
            selected.filter(isPokemon).length !== maxPokemons || selected.filter(isTrainer).length !== maxTrainers ||
            selected.filter(isEnergy).length !== maxEnergies) {
            throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
          }
          attackStore.prompt(attackState, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => {
            MOVE_CARDS(attackStore, attackState, source, player.hand, { cards: selected, sourceCard: attacker, sourceEffect: effect });
          });
        });
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 40);
    }

    return state;
  }
}
