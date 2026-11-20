import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils, PlayerType } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import {
  ABILITY_USED, DRAW_CARDS_UNTIL_CARDS_IN_HAND, WAS_ATTACK_USED, WAS_POWER_USED
} from '../../game/store/prefabs/prefabs';
import { CardList } from '../../game/store/state/card-list';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { Card } from '../../game/store/card/card';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';

export class Delphox extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Braixen';
  public hp: number = 160;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public powers = [{
    name: 'Flare Magic',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may discard a Basic [R] Energy from your hand in order to use this Ability. Draw cards until you have 7 cards in your hand.'
  }];

  public attacks = [{
    name: 'Energy Storm',
    cost: [R, R],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage times the number of Energy attached to all Pokemon in play.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public usSetNumber = 'CRI 13';
  public name: string = 'Delphox';
  public fullName: string = 'Delphox M4';

  private readonly FLARE_MAGIC_MARKER = 'DELPHOX_M4_FLARE_MAGIC_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: Pokémon TCG Advanced Player’s Rulebook E-12 and E-30.
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const slot = effect.target ?? StateUtils.findCardList(state, this);
      if (!(slot instanceof PokemonCardList) || slot.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (slot.marker.hasMarker(this.FLARE_MAGIC_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      const fireEnergy = player.hand.cards.filter(card =>
        card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.provides.includes(R)
      );
      // The discard is a cost. There must be a card to draw after paying it.
      if (fireEnergy.length === 0 || player.deck.cards.length === 0 || player.hand.cards.length > 7) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const discardAndDraw = (card: Card) => {
        slot.marker.addMarker(this.FLARE_MAGIC_MARKER, this, 'ability-use', 'pokemon');
        ABILITY_USED(player, this);
        player.hand.moveCardTo(card, player.discard);
        DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 7);
      };
      if (fireEnergy.length === 1) {
        discardAndDraw(fireEnergy[0]);
        return state;
      }
      const choices = new CardList();
      choices.cards = fireEnergy;
      return store.prompt(state, new ChooseCardsPrompt(
        player, GameMessage.CHOOSE_ENERGY_TO_DISCARD, choices, {}, { min: 1, max: 1, allowCancel: true }
      ), selected => {
        if (selected?.length) discardAndDraw(selected[0]);
      });
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      // Ref: StateUtils.getProvidesUnitCount distinguishes alternative types
      // (Blend Energy) from multiple simultaneous units (Ignition Energy).
      let totalEnergy = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const checkEnergy = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkEnergy);
        checkEnergy.energyMap.forEach(em => { totalEnergy += StateUtils.getProvidesUnitCount(em.provides); });
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const checkEnergy = new CheckProvidedEnergyEffect(opponent, cardList);
        store.reduceEffect(state, checkEnergy);
        checkEnergy.energyMap.forEach(em => { totalEnergy += StateUtils.getProvidesUnitCount(em.provides); });
      });
      effect.damage = 30 * totalEnergy;
    }
    return state;
  }
}
