import { AttachEnergyPrompt, CardList, CardTarget, CardType, EnergyType, GameError, GameMessage, PlayerType, PokemonCard, PowerType, ShowCardsPrompt, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from "../../game";
import { CheckPokemonTypeEffect } from "../../game/store/effects/check-effects";
import { Effect } from "../../game/store/effects/effect";
import { AttachEnergyEffect } from "../../game/store/effects/play-card-effects";
import { EnergyCard } from "../../game/store/card/energy-card";
import { ShuffleDeckPrompt } from "../../game/store/prompts/shuffle-prompt";
import { WAS_POWER_USED, IS_ABILITY_BLOCKED, USE_ABILITY_ONCE_PER_TURN, ABILITY_USED, SHUFFLE_DECK, REMOVE_MARKER_AT_END_OF_TURN, MOVE_CARDS } from "../../game/store/prefabs/prefabs";

export class KommoO extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Hakamo-o';
  public cardType: CardType = N;
  public hp: number = 160;
  public weakness = [];
  public retreat = [C, C];

  public powers = [{
    name: 'Beat Scales',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may use this Ability. Look at the top 6 cards of your deck and attach any number of Basic Energy cards you find there to your [N] Pokémon in any way you like. Shuffle the other cards back into your deck.'
  }];

  public attacks = [{
    name: 'Hammer In',
    cost: [L, F, C],
    damage: 170,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = 'DLR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Kommo-o';
  public fullName: string = 'Kommo-o M6';

  public readonly SCALE_BEAT_MARKER = 'KOMMO_O_SCALE_BEAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-delta-reign/mega-rayquaza-ex.ts (Ruler's Roar, look before attaching and notify after shuffling).
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.SCALE_BEAT_MARKER, this);
      ABILITY_USED(player, this);

      const deckTop = new CardList();
      // Keep the inspected cards in the deck until the player chooses which to attach.
      deckTop.cards = player.deck.cards.slice(0, 6);
      return store.prompt(state, new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, deckTop.cards), () => {
        const filter = { superType: SuperType.ENERGY, energyType: EnergyType.BASIC };
        const blocked: number[] = [];
        deckTop.cards.forEach((card, index) => {
          if (card.superType !== SuperType.ENERGY || card.energyType !== EnergyType.BASIC) blocked.push(index);
        });

        const blockedTo: CardTarget[] = [];
        let hasDragon = false;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, _card, target) => {
          const type = new CheckPokemonTypeEffect(slot);
          store.reduceEffect(state, type);
          if (type.cardTypes.includes(CardType.DRAGON)) hasDragon = true;
          else blockedTo.push(target);
        });

        const max = deckTop.cards.length - blocked.length;
        if (max === 0 || !hasDragon) {
          return SHUFFLE_DECK(store, state, player);
        }
        store.prompt(state, new AttachEnergyPrompt(
          player.id, GameMessage.ATTACH_ENERGY_CARDS, deckTop, PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH], filter, { allowCancel: false, min: 0, max, blocked, blockedTo }
        ), transfers => {
          const attached = transfers.map(({ card, to }) => {
            const target = StateUtils.getTarget(state, player, to);
            MOVE_CARDS(store, state, player.deck, target, { cards: [card], sourceCard: this, sourceEffect: this.powers[0] });
            return { card: card as EnergyCard, target };
          });
          store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            for (const { card, target } of attached) {
              if (target.cards.includes(card)) store.reduceEffect(state, new AttachEnergyEffect(player, card, target, 'deck'));
            }
          });
        });
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SCALE_BEAT_MARKER, this);

    return state;
  }
}
