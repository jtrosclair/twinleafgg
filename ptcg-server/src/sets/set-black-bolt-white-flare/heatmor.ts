import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { EnergyCard, State, StateUtils, StoreLike, ChooseCardsPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, SHUFFLE_DECK, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Heatmor extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp = 120;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Licking Catch',
    cost: [R],
    damage: 0,
    text: 'Search your deck for up to 3 in any combination of Fire Pokémon and Basic Fire Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.',
  }, {
    name: 'Fire Claws',
    cost: [R, R],
    damage: 60,
    text: '',
  }];

  public regulationMark = 'I';
  public set = 'WHT';
  public cardImage = 'assets/cardback.png';
  public setNumber = '19';
  public name = 'Heatmor';
  public fullName = 'Heatmor WHT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) return state;

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        const firePokemon = card instanceof PokemonCard &&
          (card.cardType === CardType.FIRE || card.additionalCardTypes?.includes(CardType.FIRE));
        const fireEnergy = card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.provides.includes(CardType.FIRE);
        if (!firePokemon && !fireEnergy) blocked.push(index);
      });

      return store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck, {}, { min: 0, max: 3, allowCancel: false, blocked }), selected => {
        const cards = selected || [];
        if (cards.length > 0) SHOW_CARDS_TO_PLAYER(store, state, StateUtils.getOpponent(state, player), cards);
        MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
        SHUFFLE_DECK(store, state, player);
      });
    }
    return state;
  }
}
