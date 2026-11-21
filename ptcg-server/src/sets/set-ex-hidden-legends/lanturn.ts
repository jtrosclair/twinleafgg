import { GameMessage, PlayerType, State, StoreLike, StateUtils } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType, EnergyType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { getAttachedBasicEnergy, getAttachedEnergyOfType } from '../../game/store/prefabs/knock-out-effects';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED, WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE } from '../../game/store/prefabs/prefabs';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { SlotType, CardTarget } from '../../game/store/actions/play-card-action';
import { CardList } from '../../game/store/state/card-list';
import { attackEffectKnockOuts } from '../../game/store/state/pokemon-card-list';
import { GamePhase } from '../../game/store/state/state';

export class Lanturn extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Chinchou';
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [{
    name: 'Energy Grounding',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your opponent\'s turn, when any of your Pokémon is Knocked Out by your opponent\'s attacks, you may use this power. Choose a basic Energy card discarded from the Knocked Out Pokémon and attach it to Lanturn. You can\'t use more than 1 Energy Grounding Poké-Power each turn.'
  }];

  public attacks = [{
    name: 'Lightning Strike',
    cost: [L, L, C],
    damage: 50,
    text: 'You may discard all [L] Energy attached to Lanturn. If you do, this attack\'s base damage is 90 instead of 50.'
  }];

  public set: string = 'HL';
  public setNumber: string = '38';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lanturn';
  public fullName: string = 'Lanturn HL';

  public readonly ENERGY_GROUNDING_MARKER = 'ENERGY_GROUNDING_MARKER';
  public usedLightningStrike = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof KnockOutEffect && effect.resolveBeforeDiscard && state.phase === GamePhase.ATTACK) {
      this.registerEnergyGrounding(store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const { player, source } = effect;
      const lightning = getAttachedEnergyOfType(store, state, player, source, CardType.LIGHTNING);
      if (lightning.length > 0) {
        CONFIRMATION_PROMPT(store, state, player, confirmed => {
          if (!confirmed) return;
          MOVE_CARDS(store, state, source, player.discard, { cards: lightning, sourceCard: this, sourceEffect: effect });
          if (lightning.every(card => !source.cards.includes(card) && !source.energies.cards.includes(card))) {
            effect.damage = 90;
          }
        }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
      }
    }

    return state;
  }

  // Ref: set-arceus/lucky-egg.ts (check the actual discard destination).
  private registerEnergyGrounding(store: StoreLike, state: State, effect: KnockOutEffect): void {
    const { player, target } = effect;
    const attacker = state.players[state.activePlayer];
    const knockedOut = target.getPokemonCard();
    if (!knockedOut || player === attacker) return;
    const attackKO = attackEffectKnockOuts.get(knockedOut);
    const damageKO: boolean = WAS_KNOCKED_OUT_BY_OPPONENT_ATTACK_DAMAGE(state, effect);
    if (!damageKO && !(attackKO?.playerId === attacker.id && attackKO.turn === state.turn)) return;

    const usage = this.ENERGY_GROUNDING_MARKER + '_' + state.turn;
    if (player.marker.hasMarker(usage)) return;
    const abilities = [player.active, ...player.bench].filter(slot => slot !== target
      && !effect.simultaneousKnockOuts?.has(slot)).flatMap(slot => {
      const card = slot.getPokemonCard();
      return card instanceof Lanturn && !IS_POKEPOWER_BLOCKED(store, state, player, card) ? [card] : [];
    });
    if (abilities[0] !== this) return;

    const attached = getAttachedBasicEnergy(target);
    effect.afterDiscard.set(this, { resolve: () => {
      if (player.marker.hasMarker(usage)) return;
      const energy = new CardList();
      energy.cards = attached.filter(card => player.discard.cards.includes(card));
      if (!energy.cards.length) return;

      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_slot, card, address) => {
        if (!(card instanceof Lanturn) || !abilities.includes(card)) blockedTo.push(address);
      });
      store.prompt(state, new AttachEnergyPrompt(player.id, GameMessage.ATTACH_ENERGY_CARDS,
        energy, PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: true, min: 0, max: 1, blockedTo }), transfers => {
        const transfer = transfers?.[0];
        if (!transfer || player.marker.hasMarker(usage)) return;
        const recipient = StateUtils.getTarget(state, player, transfer.to);
        const sourceCard = recipient.getPokemonCard();
        MOVE_CARDS(store, state, player.discard, recipient, { cards: [transfer.card], sourceCard, sourceEffect: effect });
        player.marker.markers = player.marker.markers.filter(marker =>
          !marker.name.startsWith(this.ENERGY_GROUNDING_MARKER + '_'));
        player.marker.addMarkerToState(usage);
      });
    } });
  }
}
