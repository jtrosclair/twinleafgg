import { CheckManualEnergyAttachmentCountEffect } from '../../game/store/effects/play-card-effects';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerType, State, StoreLike } from '../../game';
export class Venusaur extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Ivysaur';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Harvest Bounty',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if you attach an Energy card to your Active Pokémon as part of your turn, you may attach an additional Energy card to that Pokémon at the same time. This power can\'t be used if Venusaur is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Body Slam',
    cost: [G, G, C, C],
    damage: 40,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'EX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Venusaur';
  public fullName: string = 'Venusaur EX';

  public readonly HARVEST_BOUNTY_MARKER = 'HARVEST_BOUNTY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-lost-thunder/primarina.ts (simultaneous manual attachment).
    if (effect instanceof CheckManualEnergyAttachmentCountEffect && effect.target === effect.player.active) {
      const holder = StateUtils.findPokemonSlot(state, this);
      if (holder?.getPokemonCard() === this && StateUtils.isPokemonInPlay(effect.player, this)
        && holder.specialConditions.length === 0 && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
        effect.allowSecond = true;
      }
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.HARVEST_BOUNTY_MARKER, this);

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, effect);
        }
      });
    }

    return state;
  }
}