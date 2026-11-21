import { Effect } from './effect';
import type { AttackEffect } from './game-effects';
import { EnergyCard } from '../card/energy-card';
import { Player } from '../state/player';
import { PokemonCard } from '../card/pokemon-card';
import type { PowerType } from '../card/pokemon-types';
import { PokemonCardList } from '../state/pokemon-card-list';
import { TrainerCard } from '../card/trainer-card';
import { CardList } from '../state/card-list';
import { Card } from '../card/card';
import { Stage } from '../card/card-types';
import { SlotType } from '../actions/play-card-action';
import { State } from '../state/state';

export enum PlayCardEffects {
  ATTACH_ENERGY_EFFECT = 'ATTACH_ENERGY_EFFECT',
  AFTER_ATTACH_ENERGY_EFFECT = 'AFTER_ATTACH_ENERGY_EFFECT',
  PLAY_POKEMON_EFFECT = 'PLAY_POKEMON_EFFECT',
  AFTER_BENCH_BASIC_POKEMON_EFFECT = 'AFTER_BENCH_BASIC_POKEMON_EFFECT',
  AFTER_PLAY_BASIC_FROM_HAND_EFFECT = 'AFTER_PLAY_BASIC_FROM_HAND_EFFECT',
  PLAY_POKEMON_FROM_DECK_EFFECT = 'PLAY_POKEMON_FROM_DECK_EFFECT',
  PLAY_POKEMON_FROM_DISCARD_EFFECT = 'PLAY_POKEMON_FROM_DISCARD_EFFECT',
  PLAY_SUPPORTER_EFFECT = 'PLAY_SUPPORTER_EFFECT',
  PLAY_STADIUM_EFFECT = 'PLAY_STADIUM_EFFECT',
  PLAY_POKEMON_TOOL_EFFECT = 'PLAY_POKEMON_TOOL_EFFECT',
  AFTER_ATTACH_POKEMON_TOOL_FROM_HAND_EFFECT = 'AFTER_ATTACH_POKEMON_TOOL_FROM_HAND_EFFECT',
  PLAY_ITEM_EFFECT = 'PLAY_ITEM_EFFECT',
  TRAINER_EFFECT = 'TRAINER_EFFECT',
  ENERGY_EFFECT = 'ENERGY_EFFECT',
  TOOL_EFFECT = 'TOOL_EFFECT',
  STADIUM_EFFECT = 'STADIUM_EFFECT',
  SUPPORTER_EFFECT = 'SUPPORTER_EFFECT',
  CHECK_ATTACK_COIN_REFLIP_EFFECT = 'CHECK_ATTACK_COIN_REFLIP_EFFECT',
  COIN_FLIP_EFFECT = 'COIN_FLIP_EFFECT',
  COIN_FLIP_SEQUENCE_EFFECT = 'COIN_FLIP_SEQUENCE_EFFECT',
  TRAINER_CARD_TO_DECK_EFFECT = 'TRAINER_CARD_TO_DECK_EFFECT',
  DISCARD_TO_HAND_EFFECT = 'DISCARD_TO_HAND_EFFECT',
  TRAINER_TARGET_EFFECT = 'TRAINER_TARGET_EFFECT',
}

/** Check whether a Stadium effect can be applied to an in-play Pokémon. */
export class StadiumEffect implements Effect {
  readonly type: string = PlayCardEffects.STADIUM_EFFECT;
  public preventDefault = false;
  public skipAbilityLockCheck = false;

  constructor(public player: Player, public target: PokemonCardList, public stadium?: Card) {}
}

export class AttachEnergyEffect implements Effect {
  readonly type: string = PlayCardEffects.ATTACH_ENERGY_EFFECT;
  public preventDefault = false;
  public player: Player;
  public energyCard: EnergyCard;
  public target: PokemonCardList;
  /** Whether the player is taking their regular Energy attachment for the turn. */
  public isManual: boolean;
  /** Set by the hand attachment resolver after checking interception and payment. */
  public handAttachmentPrepared = false;
  public completionBatch?: AfterAttachEnergyEffect[];
  public sourcePower?: PowerType;
  public sourceCard?: Card;

  constructor(
    player: Player, energyCard: EnergyCard, target: PokemonCardList,
    public readonly sourceZone?: 'deck' | 'discard' | 'in-play' | 'prizes',
    /** A detached selection, such as the cards being looked at or an in-play card changing roles. */
    public readonly sourceList?: CardList,
  ) {
    this.player = player;
    this.energyCard = energyCard;
    this.target = target;
    this.isManual = sourceZone === undefined;
  }
}

/** An individual legacy reducer can still check the legality of an Energy card and target. */
export class CheckEnergyAttachmentEffect implements Effect {
  readonly type = 'CHECK_ENERGY_ATTACHMENT_EFFECT';
  public preventDefault = false;

  constructor(public readonly attachment: AttachEnergyEffect) {}
}

export class CheckHandEnergyInterceptionEffect implements Effect {
  readonly type = 'CHECK_HAND_ENERGY_INTERCEPTION_EFFECT';
  public preventDefault = false;
  public requiresHeads = false;

  constructor(public readonly player: Player) {}
}

export class CheckManualEnergyAttachmentCountEffect implements Effect {
  readonly type = 'CHECK_MANUAL_ENERGY_ATTACHMENT_COUNT_EFFECT';
  public preventDefault = false;
  public allowSecond = false;

  constructor(public readonly player: Player, public readonly target: PokemonCardList) {}
}

/** Resolve a selection of hand Energy together before reporting any successful attachments. */
export class AttachEnergyFromHandEffect implements Effect {
  readonly type = 'ATTACH_ENERGY_FROM_HAND_EFFECT';
  public preventDefault = false;

  constructor(
    public readonly player: Player,
    public readonly attachments: AttachEnergyEffect[],
    public readonly useTurnAttachment = false,
    public readonly onAttached?: (state: State, attached: AttachEnergyEffect[]) => void,
  ) {}
}

export interface HandEnergyReaction {
  label: string;
  attachmentLabel?: string;
  canResolve: () => boolean;
  resolve: () => void;
}

export interface QueuedHandEnergyReaction extends HandEnergyReaction {
  target: PokemonCardList;
}

export class AfterAttachEnergyEffect implements Effect {
  readonly type: string = PlayCardEffects.AFTER_ATTACH_ENERGY_EFFECT;
  public preventDefault = false;
  public discardEnergy = false;
  public readonly activePokemonAtAttachment: PokemonCard | undefined;
  public readonly recipientAtAttachment: PokemonCard | undefined;
  public readonly reactions = new Map<string, HandEnergyReaction>();
  public reactionBatch?: QueuedHandEnergyReaction[];

  constructor(public player: Player, public energyCard: EnergyCard, public target: PokemonCardList) {
    this.activePokemonAtAttachment = player.active.getPokemonCard();
    this.recipientAtAttachment = target.getPokemonCard();
  }
}

/** Sent only after an Energy card was successfully attached from the hand. */
export class AfterAttachEnergyFromHandEffect extends AfterAttachEnergyEffect {
  constructor(player: Player, energyCard: EnergyCard, target: PokemonCardList, public readonly sourcePower?: PowerType) {
    super(player, energyCard, target);
  }
}

export class PlayPokemonEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_POKEMON_EFFECT;
  public preventDefault = false;
  public player: Player;
  public pokemonCard: PokemonCard;
  public target: PokemonCardList;
  public slot?: SlotType;
  public index?: number;

  constructor(player: Player, pokemonCard: PokemonCard, target: PokemonCardList, slot?: SlotType, index?: number) {
    this.player = player;
    this.pokemonCard = pokemonCard;
    this.target = target;
    this.slot = slot;
    this.index = index;
    if (pokemonCard.stage === Stage.BASIC) {
      this.target.showBasicAnimation = true;
    }
  }
}

export class PlaySupporterEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_SUPPORTER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: CardList | undefined;

  constructor(player: Player, trainerCard: TrainerCard, target?: CardList) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export class PlayStadiumEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_STADIUM_EFFECT;
  public preventDefault = false;
  /** A dual Stadium's Trainer-cancellation coin was resolved before propagation. */
  public dualCancellationChecked = false;
  public player: Player;
  public trainerCard: TrainerCard;

  constructor(player: Player, trainerCard: TrainerCard) {
    this.player = player;
    this.trainerCard = trainerCard;
  }
}

export class AttachPokemonToolEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_POKEMON_TOOL_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: PokemonCardList;

  constructor(player: Player, trainerCard: TrainerCard, target: PokemonCardList) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export class AfterAttachPokemonToolFromHandEffect implements Effect {
  readonly type: string = PlayCardEffects.AFTER_ATTACH_POKEMON_TOOL_FROM_HAND_EFFECT;
  public preventDefault = false;

  constructor(public player: Player, public trainerCard: TrainerCard, public target: PokemonCardList) {}
}

export class PlayItemEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_ITEM_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: CardList | undefined;

  constructor(player: Player, trainerCard: TrainerCard, target?: CardList) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export interface BenchPlayReaction {
  source: Card;
  label: string;
  priority?: number;
  canResolve: () => boolean;
  resolve: () => void;
}

export class AfterBenchBasicPokemonEffect implements Effect {
  readonly type: string = PlayCardEffects.AFTER_BENCH_BASIC_POKEMON_EFFECT;
  public preventDefault = false;
  public readonly reactions: BenchPlayReaction[] = [];
  public endTurn = false;

  constructor(public readonly player: Player, public readonly pokemonCard: PokemonCard,
    public readonly target: PokemonCardList) {}
}

export class AfterPlayBasicFromHandEffect extends AfterBenchBasicPokemonEffect {
  readonly type = PlayCardEffects.AFTER_PLAY_BASIC_FROM_HAND_EFFECT;

  constructor(player: Player, pokemonCard: PokemonCard, target: PokemonCardList, public readonly playedByOwner = true) {
    super(player, pokemonCard, target);
  }
}

export class TrainerEffect implements Effect {
  readonly type: string = PlayCardEffects.TRAINER_EFFECT;
  public preventDefault = false;
  public supporterCostPaid = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: CardList | undefined;

  constructor(player: Player, trainerCard: TrainerCard, target?: CardList) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

/** Resolves a borrowed Supporter's printed effect without playing the card. */
export class CopiedSupporterEffect extends TrainerEffect {
  public maximumSupporterPlays?: number;

  constructor(
    player: Player,
    trainerCard: TrainerCard,
    public readonly sourceZone: 'hand' | 'discard' | 'lostzone' = 'hand',
    public readonly attackSource?: AttackEffect,
  ) {
    super(player, trainerCard);
  }
}

export class EnergyEffect implements Effect {
  readonly type: string = PlayCardEffects.ENERGY_EFFECT;
  public preventDefault = false;
  public player: Player;
  public card: EnergyCard;

  constructor(player: Player, card: EnergyCard) {
    this.player = player;
    this.card = card;
  }
}

export class ToolEffect implements Effect {
  readonly type: string = PlayCardEffects.TOOL_EFFECT;
  public preventDefault = false;
  public player: Player;
  public card: TrainerCard;

  constructor(player: Player, card: TrainerCard) {
    this.player = player;
    this.card = card;
  }
}

export class SupporterEffect implements Effect {
  readonly type: string = PlayCardEffects.SUPPORTER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public card: TrainerCard;
  public target: CardList | undefined;

  constructor(player: Player, card: TrainerCard) {
    this.player = player;
    this.card = card;
  }
}

export class CheckAttackCoinReflipEffect implements Effect {
  readonly type = PlayCardEffects.CHECK_ATTACK_COIN_REFLIP_EFFECT;
  public preventDefault = false;
  public readonly sources = new Map<string, Card>();

  constructor(
    public readonly player: Player,
    public readonly attacker: PokemonCardList,
    public readonly playerFlipped: boolean,
  ) {}
}

export class CoinFlipEffect implements Effect {
  readonly type: string = PlayCardEffects.COIN_FLIP_EFFECT;
  public preventDefault = false;
  public player: Player;
  public callback?: (result: boolean) => void;
  public result?: boolean;
  /** Optional card effect override (for example, Shiftry's Unlucky Wind). */
  public forcedResult?: boolean;
  /** Exclude non-attack coins and the individual flips inside an attack sequence. */
  public skipAttackReflip?: boolean;

  constructor(player: Player, callback?: (result: boolean) => void) {
    this.player = player;
    this.callback = callback;
  }
}

export class CoinFlipSequenceEffect implements Effect {
  readonly type: string = PlayCardEffects.COIN_FLIP_SEQUENCE_EFFECT;
  public preventDefault = false;
  public player: Player;
  /** One player's series or an ordered list of players who each flip once. */
  public mode: 'untilTails' | number | readonly Player[];
  public callback: (results: boolean[]) => void;

  constructor(player: Player, mode: CoinFlipSequenceEffect['mode'], callback: (results: boolean[]) => void) {
    this.player = player;
    this.mode = mode;
    this.callback = callback;
  }
}

export class TrainerToDeckEffect implements Effect {
  readonly type: string = PlayCardEffects.TRAINER_CARD_TO_DECK_EFFECT;
  public preventDefault = false;
  public player: Player;
  public card: TrainerCard;

  constructor(player: Player, card: TrainerCard) {
    this.player = player;
    this.card = card;
  }
}

export class DiscardToHandEffect implements Effect {
  readonly type: string = PlayCardEffects.DISCARD_TO_HAND_EFFECT;
  public preventDefault = false;
  public player: Player;
  public card: Card;

  constructor(player: Player, card: Card) {
    this.player = player;
    this.card = card;
  }
}

export class TrainerTargetEffect implements Effect {
  readonly type: string = PlayCardEffects.TRAINER_TARGET_EFFECT;
  public preventDefault = false;
  public player: Player;
  public trainerCard: TrainerCard;
  public target: PokemonCardList | undefined;

  constructor(player: Player, trainerCard: TrainerCard, target?: PokemonCardList) {
    this.player = player;
    this.trainerCard = trainerCard;
    this.target = target;
  }
}

export class PlayPokemonFromDeckEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_POKEMON_FROM_DECK_EFFECT;
  public preventDefault = false;
  public player: Player;
  public pokemonCard: PokemonCard;
  public target: PokemonCardList;
  public slot?: SlotType;
  public index?: number;
  public completionBatch?: AfterBenchBasicPokemonEffect[];

  constructor(player: Player, pokemonCard: PokemonCard, target: PokemonCardList, slot?: SlotType, index?: number) {
    this.player = player;
    this.pokemonCard = pokemonCard;
    this.target = target;
    this.slot = slot;
    this.index = index;
    if (pokemonCard.stage === Stage.BASIC) {
      this.target.showBasicAnimation = true;
    }
  }
}

export class PlayPokemonFromDiscardEffect implements Effect {
  readonly type: string = PlayCardEffects.PLAY_POKEMON_FROM_DISCARD_EFFECT;
  public preventDefault = false;
  public player: Player;
  public pokemonCard: PokemonCard;
  public target: PokemonCardList;
  public slot?: SlotType;
  public index?: number;

  constructor(player: Player, pokemonCard: PokemonCard, target: PokemonCardList, slot?: SlotType, index?: number) {
    this.player = player;
    this.pokemonCard = pokemonCard;
    this.target = target;
    this.slot = slot;
    this.index = index;
    if (pokemonCard.stage === Stage.BASIC) {
      this.target.showBasicAnimation = true;
    }
  }
}
