import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, PowerType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ChoosePokemonPrompt } from '../../game/prompts/choose-pokemon-prompt';
import { BLOCK_IF_GX_ATTACK_USED, DAMAGE_OPPONENT_POKEMON } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { CardList } from '../../game/store/state/card-list';

export class NaganadelGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.DRAGON;
  public hp: number = 210;
  public weakness = [{ type: CardType.FAIRY }];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = 'Poipole';

  public powers = [{
    name: 'Ultra Conversion',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may discard an Ultra Beast card from your hand. If you do, draw 3 cards.'
  }];

  public attacks = [
    {
      name: 'Venom Shot',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Discard 2 Energy from this Pokémon. This attack does 170 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Injection-GX',
      cost: [CardType.LIGHTNING],
      damage: 0,
      text: 'Add a card from your opponent\'s discard pile to their Prize cards face down. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '160';
  public name = 'Naganadel-GX';
  public fullName = 'Naganadel-GX UNM';

  public readonly ULTRA_CONVERSION_MARKER = 'ULTRA_CONVERSION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Remove Ultra Conversion marker at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ULTRA_CONVERSION_MARKER)) {
      effect.player.marker.removeMarker(this.ULTRA_CONVERSION_MARKER, this);
    }

    // Ultra Conversion ability
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.ULTRA_CONVERSION_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Check if there's an Ultra Beast in hand
      const hasUltraBeast = player.hand.cards.some(c => {
        return c instanceof PokemonCard && c.tags.includes(CardTag.ULTRA_BEAST);
      });

      if (!hasUltraBeast) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.tags.includes(CardTag.ULTRA_BEAST)) {
          return;
        } else {
          blocked.push(index);
        }
      });

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: true, min: 1, max: 1, blocked }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        player.marker.addMarker(this.ULTRA_CONVERSION_MARKER, this);
        player.hand.moveCardsTo(cards, player.discard);
        player.deck.moveTo(player.hand, 3);
      });

      return state;
    }

    // Venom Shot attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // First discard 2 energy from this Pokemon
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);

      // Then deal 170 damage to 1 opponent's Pokemon
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 170, targets);
      });
    }

    // Injection-GX attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      if (opponent.discard.cards.length === 0) {
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        opponent,
        GameMessage.CHOOSE_CARD_TO_HAND,
        opponent.discard,
        {},
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        const selectedCard = cards[0];

        // Add the selected card to opponent's prizes
        const allPrizeCards = new CardList();
        opponent.prizes.forEach(prizeList => {
          allPrizeCards.cards.push(...prizeList.cards);
        });

        // Add the card from discard to prizes
        opponent.discard.moveCardsTo([selectedCard], allPrizeCards);

        // Redistribute the prize cards
        const prizeCount = allPrizeCards.cards.length;
        opponent.prizes = [];
        for (let i = 0; i < prizeCount; i++) {
          const newPrizeList = new CardList();
          newPrizeList.cards.push(allPrizeCards.cards[i]);
          newPrizeList.isSecret = true; // Make the new prize face down
          opponent.prizes.push(newPrizeList);
        }
      });
    }

    return state;
  }
}
