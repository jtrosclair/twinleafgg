import { AttachEnergyPrompt, CardList, CardType, ChooseCardsPrompt, EnergyType, GameError, GameMessage, PlayerType, PokemonCard, PowerType, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from "../../game";
import { CheckPokemonTypeEffect } from "../../game/store/effects/check-effects";
import { Effect } from "../../game/store/effects/effect";
import { AttachEnergyEffect } from "../../game/store/effects/play-card-effects";
import { EnergyCard } from "../../game/store/card/energy-card";
import { ShuffleDeckPrompt } from "../../game/store/prompts/shuffle-prompt";
import { WAS_POWER_USED, IS_ABILITY_BLOCKED, USE_ABILITY_ONCE_PER_TURN, ABILITY_USED, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, REMOVE_MARKER_AT_END_OF_TURN, MOVE_CARDS } from "../../game/store/prefabs/prefabs";

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

  private getDragonBlockedTargets(store: StoreLike, state: State, player: State['players'][number]) {
    const blockedTo: { player: PlayerType; slot: SlotType; index: number }[] = [];

    const activePokemon = player.active.getPokemonCard();
    if (activePokemon) {
      const checkType = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkType);
      if (!checkType.cardTypes.includes(CardType.DRAGON)) {
        blockedTo.push({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 });
      }
    } else {
      blockedTo.push({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 });
    }

    player.bench.forEach((bench, index) => {
      const pokemon = bench.getPokemonCard();
      if (!pokemon) {
        blockedTo.push({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index });
        return;
      }

      const checkType = new CheckPokemonTypeEffect(bench);
      store.reduceEffect(state, checkType);
      if (!checkType.cardTypes.includes(CardType.DRAGON)) {
        blockedTo.push({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index });
      }
    });
    return blockedTo;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scale Beat
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
      const cardsToLook = Math.min(6, player.deck.cards.length);
      MOVE_CARDS(store, state, player.deck, deckTop, { count: cardsToLook, sourceCard: this });

      SHOW_CARDS_TO_PLAYER(store, state, player, deckTop.cards);

      // One prompt selects any Basic Energy and assigns each to a Dragon.
      // Blocking every other card prevents unrelated cards from being attached.
      const blocked = deckTop.cards.map((card, index) =>
        card.superType === SuperType.ENERGY && card.energyType === EnergyType.BASIC ? -1 : index
      ).filter(index => index !== -1);
      const eligibleCount = deckTop.cards.length - blocked.length;
      if (eligibleCount === 0) {
        MOVE_CARDS(store, state, deckTop, player.deck, { sourceCard: this, sourceEffect: this.powers[0] });
        return SHUFFLE_DECK(store, state, player);
      }
      const blockedTo = this.getDragonBlockedTargets(store, state, player);
      return store.prompt(state, new AttachEnergyPrompt(
        player.id, GameMessage.ATTACH_ENERGY_CARDS, deckTop, PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH], { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 0, max: eligibleCount, blocked, blockedTo },
      ), transfers => {
        const attached: Array<{card: EnergyCard, target: ReturnType<typeof StateUtils.getTarget>}> = [];
        const seen = new Set<EnergyCard>();
        for (const transfer of transfers || []) {
          const energy = transfer.card as EnergyCard;
          if (seen.has(energy)) continue;
          seen.add(energy);
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, deckTop, target, { cards: [energy], sourceCard: this, sourceEffect: this.powers[0] });
          if (target.cards.includes(energy)) attached.push({card: energy, target});
        }
        MOVE_CARDS(store, state, deckTop, player.deck, { sourceCard: this, sourceEffect: this.powers[0] });
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          for (const entry of attached) {
            if (entry.target.cards.includes(entry.card)) store.reduceEffect(state, new AttachEnergyEffect(player, entry.card, entry.target));
          }
        });
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SCALE_BEAT_MARKER, this);

    return state;
  }
}
