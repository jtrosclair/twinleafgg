import {
  AttachEnergyPrompt,
  Card,
  CardTag,
  CardType,
  ChooseEnergyPrompt,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  PokemonCard,
  PokemonCardList,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { EffectOfAbilityEffect, PowerEffect } from '../../game/store/effects/game-effects';
import {
  CONFIRMATION_PROMPT,
  IS_POKEBODY_BLOCKED,
  MOVE_CARDS,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';

function findInPlayPokemon(state: State, pokemon: PokemonCard): { player: Player; slot: PokemonCardList } | undefined {
  for (const player of state.players) {
    let found: PokemonCardList | undefined;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, card) => {
      if (card === pokemon) found = slot;
    });
    if (found) return { player, slot: found };
  }
  return undefined;
}

export class Pidgeot extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Pidgeotto';
  protected _tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = L;
  public additionalCardTypes = [M];
  public hp: number = 100;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [
    {
      name: 'Delta Reserve',
      powerType: PowerType.POKEBODY,
      text: "As long as Pidgeot has any Holon Energy cards attached to it, each player's Pokémon (excluding Pokémon that has δ on its card) can't use any Poké-Powers.",
    },
  ];

  public attacks = [
    {
      name: 'Rotating Claws',
      cost: [L, M, C],
      damage: 50,
      text: 'You may discard an Energy card attached to Pidgeot. If you do, search your discard pile for an Energy card (excluding the one you discarded) and attach it to Pidgeot.',
    },
  ];

  public set: string = 'HP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Pidgeot';
  public fullName: string = 'Pidgeot HP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const checksLockedPower = effect instanceof CheckPokemonPowersEffect
      || (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEPOWER);
    const source = checksLockedPower ? findInPlayPokemon(state, this) : undefined;
    const hasHolonEnergy = source?.slot.cards.some(
      card => card.superType === SuperType.ENERGY && card.name.includes('Holon Energy'),
    ) ?? false;
    const lockIsActive = !!source && hasHolonEnergy && !IS_POKEBODY_BLOCKED(store, state, source.player, this);

    if (lockIsActive && effect instanceof CheckPokemonPowersEffect
      && !effect.target.tags.includes(CardTag.DELTA_SPECIES)) {
      const target = findInPlayPokemon(state, effect.target);
      if (target) {
        const canApply = new EffectOfAbilityEffect(source.player, this.powers[0], this, target.slot);
        store.reduceEffect(state, canApply);
        if (canApply.target) {
          effect.powers = effect.powers.filter(power => power.powerType !== PowerType.POKEPOWER);
        }
      }
    }

    if (lockIsActive && effect instanceof PowerEffect
      && effect.power.powerType === PowerType.POKEPOWER
      && !effect.card.tags.includes(CardTag.DELTA_SPECIES)) {
      const target = findInPlayPokemon(state, effect.card);
      if (target) {
        const canApply = new EffectOfAbilityEffect(source.player, this.powers[0], this, target.slot);
        store.reduceEffect(state, canApply);
        if (canApply.target) throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    // Ref: set-ex-dragon-frontiers/charizard-star.ts (Rotating Claws)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      if (checkProvidedEnergy.energyMap.length === 0) {
        return state;
      }

      CONFIRMATION_PROMPT(
        store,
        state,
        player,
        (result) => {
          if (!result) {
            return;
          }

          state = store.prompt(
            state,
            new ChooseEnergyPrompt(
              player.id,
              GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
              checkProvidedEnergy.energyMap,
              [CardType.COLORLESS],
              { allowCancel: false },
            ),
            (energy) => {
              const cards: Card[] = (energy || []).map((e) => e.card);
              if (cards.length === 0) {
                return;
              }

              const discarded = cards[0];
              const discardEnergy = new DiscardCardsEffect(effect, cards);
              discardEnergy.target = player.active;
              store.reduceEffect(state, discardEnergy);

              const blocked: number[] = [];
              player.discard.cards.forEach((card, index) => {
                if (card === discarded || card.superType !== SuperType.ENERGY) {
                  blocked.push(index);
                }
              });

              const hasOtherEnergy = player.discard.cards.some(
                (card, index) => !blocked.includes(index),
              );
              if (!hasOtherEnergy) {
                return;
              }

              state = store.prompt(
                state,
                new AttachEnergyPrompt(
                  player.id,
                  GameMessage.ATTACH_ENERGY_TO_ACTIVE,
                  player.discard,
                  PlayerType.BOTTOM_PLAYER,
                  [SlotType.ACTIVE],
                  { superType: SuperType.ENERGY },
                  { allowCancel: false, min: 1, max: 1, blocked },
                ),
                (transfers) => {
                  transfers = transfers || [];
                  if (transfers.length === 0) {
                    return;
                  }

                  for (const transfer of transfers) {
                    const target = StateUtils.getTarget(state, player, transfer.to);
                    MOVE_CARDS(store, state, player.discard, target, {
                      cards: [transfer.card],
                      sourceCard: this,
                      sourceEffect: this.attacks[0],
                    });
                  }
                },
              );
            },
          );
        },
        GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK,
      );
    }

    return state;
  }
}
