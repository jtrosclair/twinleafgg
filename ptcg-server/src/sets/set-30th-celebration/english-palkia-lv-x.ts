import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, StateUtils, PowerType, PlayerType, SlotType, ChoosePokemonPrompt, MoveEnergyPrompt, GameMessage, GameError, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { BLOCK_IF_HAS_SPECIAL_CONDITION, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

// Printed English text: https://limitlesstcg.com/cards/30C/CC12 (GE 106).
// Uses the existing LV.X previous-level inheritance architecture, not Palkia G text.
export class EnglishPalkiaLvXCC12 extends PokemonCard {
  public stage = Stage.LV_X;
  public tags = [CardTag.POKEMON_LV_X];
  public evolvesFrom = 'Palkia';
  public hp = 120;
  public cardType = CardType.WATER;
  public weakness = [{ type: CardType.LIGHTNING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public set = '30C';
  public setNumber = 'CC12';
  public usSetNumber = '30C CC12';
  public name = 'Palkia';
  public fullName = 'Palkia LV.X 30C CC12';
  public cardImage = 'assets/cardback.png';
  public readonly RESTRUCTURE_MARKER = 'PALKIA_30C_RESTRUCTURE';
  public powers = [{
    name: 'LV.X Rule', powerType: PowerType.LV_X_RULE,
    text: 'Put this card onto your Active Palkia. Palkia LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
  }, {
    name: 'Restructure', powerType: PowerType.POKEPOWER, useWhenInPlay: true,
    text: "Once during your turn (before your attack), you may have your opponent switch 1 of your Active Pokémon with 1 of your Benched Pokémon. Then, you switch 1 of the Defending Pokémon with 1 of your opponent's Benched Pokémon. This power can't be used if Palkia is affected by a Special Condition."
  }];
  public attacks = [{
    name: 'Hydro Reflect', cost: [CardType.WATER, CardType.WATER, CardType.WATER], damage: 60,
    text: "You may move all Energy cards attached to Palkia to your Benched Pokémon in any way you like. (Ignore this effect if you don't have any Benched Pokémon.)"
  }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.RESTRUCTURE_MARKER, this);
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && effect.target !== effect.player.active) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    if (WAS_POWER_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      if (player.marker.hasMarker(this.RESTRUCTURE_MARKER, this)) { throw new GameError(GameMessage.POWER_ALREADY_USED); }
      if (!player.bench.some(b => b.cards.length > 0) || !opponent.bench.some(b => b.cards.length > 0)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      player.marker.addMarker(this.RESTRUCTURE_MARKER, this);
      return store.prompt(state, new ChoosePokemonPrompt(opponent.id, GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.TOP_PLAYER, [SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
        if (!selected || selected.length === 0) { return; }
        player.switchPokemon(selected[0], store, state);
        store.prompt(state, new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER, [SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), targets => {
          if (targets && targets.length > 0) { opponent.switchPokemon(targets[0], store, state); }
        });
      });
    }
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const source = player.active;
      const energies = source.cards.filter(c => c.superType === SuperType.ENERGY);
      if (energies.length === 0 || !player.bench.some(b => b.cards.length > 0)) { return state; }
      return store.prompt(state, new MoveEnergyPrompt(player.id, GameMessage.MOVE_ENERGY_CARDS,
        PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE, SlotType.BENCH], { superType: SuperType.ENERGY }, {
          min: energies.length, max: energies.length, allowCancel: true,
          blockedFrom: player.bench.map((b, index) => ({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index })),
          blockedTo: [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }]
        }), transfers => {
        if (transfers === null) { return; }
        if (transfers.length !== energies.length || new Set(transfers.map(t => t.card)).size !== energies.length
          || transfers.some(t => !energies.includes(t.card) || StateUtils.getTarget(state, player, t.from) !== source
            || !player.bench.includes(StateUtils.getTarget(state, player, t.to)))) {
          throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        }
        for (const transfer of transfers) { source.moveCardTo(transfer.card, StateUtils.getTarget(state, player, transfer.to)); }
      });
    }
    if (effect instanceof CheckPokemonAttacksEffect || effect instanceof CheckPokemonPowersEffect) {
      const owner = effect.player;
      const lists = [owner.active, ...owner.bench];
      const list = lists.find(l => l.getPokemonCard() === this);
      if (!list) { return state; }
      for (const previous of list.cards) {
        if (previous instanceof PokemonCard && previous !== this && previous.name === this.evolvesFrom) {
          if (effect instanceof CheckPokemonAttacksEffect) { effect.attacks.push(...previous.attacks); }
          else { effect.powers.push(...previous.powers); }
        }
      }
    }
    return state;
  }
}
