import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, CardTag, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType, StateUtils, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ATTACH_ENERGY_TRANSFERS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Whimsicottex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.POKEMON_ex];
  public evolvesFrom = 'Cottonee';
  public cardType: CardType = G;
  public hp: number = 230;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [];

  public attacks = [{
    name: 'Energy Gift',
    cost: [G],
    damage: 0,
    text: 'Search your deck for up to 3 Basic Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
  },
  {
    name: 'Wonder Cotton',
    cost: [G],
    damage: 0,
    text: 'Your opponent reveals their hand. This attack does 50 damage for each Trainer card you find there.'
  }];

  public set: string = 'WHT';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Whimsicott ex';
  public fullName: string = 'Whimsicott ex SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energy Gift
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) return state;

      return store.prompt(state, new AttachEnergyPrompt(
        player.id, GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE], { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 0, max: 3 },
      ), transfers => {
        ATTACH_ENERGY_TRANSFERS(store, state, player, transfers, 'deck', {
          sourceCard: this,
          onAttached: () => SHUFFLE_DECK(store, state, player)
        });
      });
    }
    // Wonder Cotton
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      state = store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        opponent.hand.cards
      ), () => {
        const cardsInOpponentHand = opponent.hand.cards.filter(card => card instanceof TrainerCard).length;
        const damage = opponent.hand.cards.slice(0, cardsInOpponentHand);
        effect.damage = damage.length * 50;
      });
    }
    return state;
  }
} 