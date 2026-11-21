import { PokemonCard, Stage, CardType, PowerType, State, StoreLike, StateUtils, ConfirmPrompt, GameLog, GameMessage, ChooseCardsPrompt, SuperType } from '../../game';
import { Effect, MovedFromActiveToBenchEffect } from '../../game/store/effects/game-effects';
import { getBlockedPokemonPlacementIndices } from '../../game/store/prefabs/bench-play-reactions';
import { swapInPlayPokemon } from '../../game/store/prefabs/pokemon-replacement';
import { IS_ABILITY_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class Palafin extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Finizen';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Zero to Hero',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when this Pokémon moves from the Active Spot to the Bench, you may search your deck for a Palafin ex and switch it with this Pokémon. Any attached cards, damage counters, Special Conditions, turns in play, and any other effects remain on the new Pokémon. If you switched a Pokémon in this way, put this card into your deck. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Wave Splash',
    cost: [W, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'TWM';
  public setNumber: string = '60';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Palafin TWM';
  public name: string = 'Palafin';

  public ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    if (!(effect instanceof MovedFromActiveToBenchEffect) || effect.pokemonCard !== this
      || state.players[state.activePlayer] !== effect.player) return state;

    const { player } = effect;
    const target = StateUtils.findPokemonSlot(state, this);
    if (!target || target.getPokemonCard() !== this || !player.bench.includes(target)
      || target.marker.hasMarker(this.ABILITY_USED_MARKER, this)
      || player.marker.hasMarker(this.ABILITY_USED_MARKER, this)
      || !player.deck.cards.length || IS_ABILITY_BLOCKED(store, state, player, this)) return state;

    return store.prompt(state, new ConfirmPrompt(player.id, GameMessage.WANT_TO_USE_ABILITY), use => {
      if (!use || target.getPokemonCard() !== this) return;
      target.marker.addMarker(this.ABILITY_USED_MARKER, this, 'ability-use', 'pokemon');
      store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: 'Zero to Hero' });
      const blocked = getBlockedPokemonPlacementIndices(store, state, player, player.deck, [], this);
      return store.prompt(state, new ChooseCardsPrompt(
        player, GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck,
        { superType: SuperType.POKEMON, name: 'Palafin ex' }, { min: 0, max: 1, allowCancel: false, blocked }
      ), selected => {
        const replacement = selected?.[0];
        if (replacement instanceof PokemonCard) {
          swapInPlayPokemon(store, state, player, target, player.deck, replacement, player.deck, this);
        }
        return SHUFFLE_DECK(store, state, player);
      });
    });
  }
}
