import { Marker } from '../state/card-marker';
import { Card } from './card';
import { SuperType, Stage, PokemonType, CardType, CardTag, Format } from './card-types';
import { Attack, Weakness, Resistance, Power, PowerType } from './pokemon-types';
import { TrainerCard } from './trainer-card';
import type { ActiveAbilityLock } from '../prefabs/active-ability-lock';

const RULE_BOX_TAGS = [CardTag.POKEMON_V, CardTag.POKEMON_VMAX, CardTag.POKEMON_VSTAR,
  CardTag.POKEMON_EX, CardTag.BREAK, CardTag.POKEMON_GX, CardTag.PRISM_STAR,
  CardTag.RADIANT, CardTag.POKEMON_VUNION];

export const ALPHA_RECOVERY: Power = {
  name: 'α Recovery',
  powerType: PowerType.ANCIENT_TRAIT,
  text: 'When this Pokémon is healed, double the amount healed.'
};

export abstract class PokemonCard extends Card {

  public superType: SuperType = SuperType.POKEMON;

  public cardType: CardType = CardType.COLORLESS;

  public additionalCardTypes?: CardType[];

  public cardTag: CardTag[] = [];

  public pokemonType: PokemonType = PokemonType.NORMAL;

  public evolvesFrom: string = '';

  public evolvesTo: string[] = [];

  public evolvesToStage: Stage[] = [];

  public evolvesFromBase: string[] = [];

  public legacyFullName?: string;

  /** Delayed Knock Out due when the named player's turn ends. */
  public knockOutAtEndOfTurnPlayerId?: number;

  /** Additional Colorless retreat cost until the owner's next turn ends. */
  public retreatCostIncreaseNextTurn?: number;

  public stage: Stage = Stage.BASIC;

  public retreat: CardType[] = [];

  public hp: number = 0;

  public weakness: Weakness[] = [];

  public resistance: Resistance[] = [];

  public powers: Power[] = [];

  public attacks: Attack[] = [];

  public format: Format = Format.NONE;

  public marker = new Marker();

  public movedToActiveThisTurn = false;

  public tools: TrainerCard[] = [];

  public maxTools: number = 1;

  public archetype: CardType[] = [];

  public canAttackTwice?: boolean;

  public damageTakenLastTurn?: number = 0;

  public activeAbilityLock?(): ActiveAbilityLock;

  public wasMovedToActiveThisTurn?(player: any): boolean {
    return player.movedToActiveThisTurn.includes(this.id);
  }
}

export function hasLegacyDeltaEvolution(pokemon: PokemonCard): boolean {
  return pokemon.stage === Stage.MEGA
    && pokemon.powers.some(power => power.powerType === PowerType.ANCIENT_TRAIT && power.name === 'Δ Evolution');
}

export function pokemonHasRuleBox(pokemon: PokemonCard): boolean {
  // The older lowercase ex cards have no Rule Box.
  return (pokemon.tags.includes(CardTag.POKEMON_ex) && !!pokemon.regulationMark)
    || RULE_BOX_TAGS.some(tag => pokemon.tags.includes(tag));
}

/** Returns whether a Pokémon has the requested primary or additional type. */
export function pokemonHasCardType(pokemon: PokemonCard, cardType: CardType): boolean {
  const primaryType = pokemon.cardType as unknown;
  return (Array.isArray(primaryType) ? primaryType.includes(cardType) : primaryType === cardType)
    || (pokemon.additionalCardTypes?.includes(cardType) ?? false);
}
