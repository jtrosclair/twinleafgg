import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, PlayerType, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { BLOCK_IF_GX_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class LatiosGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_GX];
  public cardType: CardType = P;
  public hp: number = 170;
  public weakness = [{ type: P }];
  public retreat = [];

  public powers = [{
    name: 'Power Bind',
    powerType: PowerType.ABILITY,
    text: 'If you have 4 or fewer Pokémon in play, this Pokémon can\'t attack.'
  }];

  public attacks = [
    {
      name: 'Tag Purge',
      cost: [P, C, C],
      damage: 120,
      text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from TAG TEAM Pokémon.'
    },
    {
      name: 'Clear Vision-GX',
      cost: [P],
      damage: 0,
      text: 'For the rest of this game, your opponent can\'t use any GX attacks. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name: string = 'Latios-GX';
  public fullName: string = 'Latios-GX UNM';

  public readonly TAG_PURGE_MARKER = 'TAG_PURGE_MARKER';
  public readonly CLEAR_TAG_PURGE_MARKER = 'CLEAR_TAG_PURGE_MARKER';
  public readonly CLEAR_VISION_GX_MARKER = 'CLEAR_VISION_GX_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Power Bind: If you have 4 or fewer Pokémon in play, this Pokémon can't attack.
    if (effect instanceof CheckAttackCostEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      let pokemonInPlay = 0;

      // Count active Pokemon
      if (player.active.cards.length > 0) {
        pokemonInPlay++;
      }

      // Count benched Pokemon
      player.bench.forEach(benchSlot => {
        if (benchSlot.cards.length > 0) {
          pokemonInPlay++;
        }
      });

      if (pokemonInPlay <= 4) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
    }

    // Tag Purge attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.TAG_PURGE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_TAG_PURGE_MARKER, this);
    }

    // Prevent damage from TAG TEAM Pokemon during opponent's next turn
    if (effect instanceof AbstractAttackEffect
      && effect.target.marker.hasMarker(this.TAG_PURGE_MARKER)) {
      const sourceCard = effect.source.getPokemonCard();

      if (sourceCard && sourceCard.tags.includes(CardTag.TAG_TEAM)) {
        effect.preventDefault = true;
      }
    }

    // Clear Tag Purge marker at end of opponent's turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_TAG_PURGE_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_TAG_PURGE_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.TAG_PURGE_MARKER, this);
      });
    }

    // Clear Vision-GX attack
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if player has used GX attack
      BLOCK_IF_GX_ATTACK_USED(player);
      // Set GX attack as used for game
      player.usedGX = true;

      // Mark opponent so they can't use GX attacks for the rest of the game
      opponent.marker.addMarker(this.CLEAR_VISION_GX_MARKER, this);
    }

    // Block opponent's GX attacks for the rest of the game
    if (effect instanceof AttackEffect) {
      const player = effect.player;

      // Check if this player is marked with Clear Vision GX
      if (player.marker.hasMarker(this.CLEAR_VISION_GX_MARKER, this)) {
        // Check if the attack is a GX attack (contains "-GX" in the name)
        if (effect.attack.name.includes('-GX')) {
          throw new GameError(GameMessage.LABEL_GX_USED);
        }
      }
    }

    return state;
  }
}
