import { AttachEnergyEffect, AttachEnergyFromHandEffect, CheckEnergyAttachmentEffect } from '../../game/store/effects/play-card-effects';
import { PokemonCard, PokemonCardList, Stage, CardType, PowerType, CardTarget, PlayerType, SlotType, StoreLike, State, GameError, GameMessage, EnergyCard, EnergyType, AttachEnergyPrompt, SuperType, StateUtils } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { WAS_POWER_USED, IS_ABILITY_BLOCKED, USE_ABILITY_ONCE_PER_TURN, ABILITY_USED, REMOVE_MARKER_AT_END_OF_TURN } from "../../game/store/prefabs/prefabs";

export class Magmortar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = "Magmar";
  public cardType: CardType = R;
  public hp: number = 140;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public powers = [{
      name: "Buddy Boost",
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      text: "Once during your turn, you may use this Ability. Attach a Basic [R] Energy card, a Basic [L] Energy card, or 1 of each from your hand to your Electivire and Magmortar in any way you like.",
    }];

  public attacks = [{
      name: "Heat Crash",
      cost: [R, R, C],
      damage: 80,
      text: "",
    }];

  public regulationMark: string = "J";
  public set: string = "DLR";
  public cardImage: string = "assets/cardback.png";
  public setNumber: string = "21";
  public name: string = "Magmortar";
  public fullName: string = "Magmortar M6";

  public readonly BUDDY_BOOST_MARKER = "MAGMORTAR_BUDDY_BOOST_MARKER";
  private readonly VALID_POKEMON_NAMES = ["Magmortar", "Electivire"];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Buddy Boost
    // Ref: set-unified-minds/haxorus.ts (validCardTypes for multiple Basic types in one prompt)
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const isValidEnergy = (card: unknown): card is EnergyCard =>
        card instanceof EnergyCard && card.energyType === EnergyType.BASIC
        && card.provides.some(type => type === CardType.FIRE || type === CardType.LIGHTNING);
      const eligible = player.hand.cards.filter(isValidEnergy);
      if (eligible.length === 0) throw new GameError(GameMessage.CANNOT_USE_POWER);
      const attachmentFor = (energy: EnergyCard, target: PokemonCardList) => {
        const attachment = new AttachEnergyEffect(player, energy, target);
        attachment.isManual = false;
        attachment.sourceCard = this;
        attachment.sourcePower = effect.power.powerType;
        return attachment;
      };
      const blockedTo: CardTarget[] = [];
      let hasValidTarget = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (target, card, location) => {
        const permitted = this.VALID_POKEMON_NAMES.includes(card.name) && eligible.some(energy => {
          try {
            store.reduceEffect(state, new CheckEnergyAttachmentEffect(attachmentFor(energy, target)));
            return true;
          } catch (error) {
            if (!(error instanceof GameError)) throw error;
            return false;
          }
        });
        if (permitted) hasValidTarget = true;
        else blockedTo.push(location);
      });
      if (!hasValidTarget) throw new GameError(GameMessage.CANNOT_USE_POWER);

      if (player.marker.hasMarker(this.BUDDY_BOOST_MARKER, this)) throw new GameError(GameMessage.POWER_ALREADY_USED);

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.hand,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          {
            allowCancel: true,
            min: 0,
            max: 2,
            blocked: player.hand.cards.flatMap((card, index) => isValidEnergy(card) ? [] : [index]),
            blockedTo,
            validCardTypes: [CardType.FIRE, CardType.LIGHTNING],
            maxPerType: 1,
          },
        ),
        (transfers) => {
          const attachments = (transfers ?? []).map(({ card, to }) => {
            if (!isValidEnergy(card)) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
            return attachmentFor(card, StateUtils.getTarget(state, player, to));
          });
          if (attachments.length === 0) return;
          USE_ABILITY_ONCE_PER_TURN(player, this.BUDDY_BOOST_MARKER, this);
          ABILITY_USED(player, this);
          store.reduceEffect(state, new AttachEnergyFromHandEffect(player, attachments));
        },
      );
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.BUDDY_BOOST_MARKER, this);

    return state;
  }
}
