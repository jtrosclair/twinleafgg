import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, PowerType, PlayerType, State, StoreLike, GameError, GameMessage } from '../../game';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PLAY_POKEMON_FROM_HAND_TO_BENCH, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';

export class Talonflameex extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage = Stage.STAGE_2; public evolvesFrom = 'Fletchinder';
  public tags = [CardTag.POKEMON_ex]; public cardType = CardType.COLORLESS; public hp = 280;
  public weakness = [{ type: CardType.LIGHTNING }]; public resistance = [{ type: CardType.FIGHTING, value: -30 }]; public retreat: CardType[] = [];
  public regulationMark = 'J'; public set = 'DLR'; public setNumber = '88'; public cardImage = 'assets/cardback.png';
  public name = 'Talonflame ex'; public fullName = 'Talonflame ex M6';
  public powers = [{ name: 'Excited Dive', powerType: PowerType.ABILITY, useFromHand: true, useFromHandToBench: true,
    text: 'Once during your turn, if this Pokémon is in your hand, and if you have any [C] Mega Evolution Pokémon ex in play, you may use this Ability. Put this Pokémon onto your Bench.' }];
  public attacks = [{ name: 'Talon Hunt', cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 150,
    text: 'You may search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.' }];
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      let eligible = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, slot => {
        const card = slot.getPokemonCard();
        if (!card || !card.tags.includes(CardTag.POKEMON_SV_MEGA) || !card.tags.includes(CardTag.POKEMON_ex)) return;
        const check = new CheckPokemonTypeEffect(slot); store.reduceEffect(state, check);
        if (check.cardTypes.includes(CardType.COLORLESS)) eligible = true;
      });
      if (!player.hand.cards.includes(this) || !eligible) throw new GameError(GameMessage.CANNOT_USE_POWER);
      if (effect.target) {
        if (!player.bench.includes(effect.target) || effect.target.cards.length !== 0) throw new GameError(GameMessage.INVALID_TARGET);
        player.hand.moveCardTo(this, effect.target);
        effect.target.pokemonPlayedTurn = state.turn;
      } else {
        PLAY_POKEMON_FROM_HAND_TO_BENCH(state, player, this);
      }
    }
    return Talonflameex.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }
  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this, {}, { min: 0, max: 2, allowCancel: false }, effect);
    return state;
  }
}
export class TalonflameexUR extends Talonflameex { public setNumber = '124'; public fullName = 'Talonflame ex UR M6'; }
