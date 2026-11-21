import { CardTag, CardType, ChoosePokemonPrompt, GameMessage, GamePhase, PlayerType, PokemonCard, PowerType, SlotType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { BLOCK_IF_GX_ATTACK_USED, CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import {DealDamageEffect} from '../../game/store/effects/attack-effects';
import { EffectOfAbilityEffect, HealEffect } from '../../game/store/effects/game-effects';
import { AfterAttachEnergyFromHandEffect } from '../../game/store/effects/play-card-effects';

export class VenusaurSnivyGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 270;
  public weakness = [{ type: R }];
  public retreat = [ C, C, C ];

  public powers = [{
    name: 'Shining Vine',
    powerType: PowerType.ABILITY,
    text: 'During your turn, if this Pokémon is your Active Pokémon, whenever you attach a [G] Energy card from your hand to it, you may switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Forest Dump',
      cost: [ G, C, C, C ],
      damage: 160,
      text: ''
    },
    {
      name: 'Solar Plant-GX',
      cost: [ C, C, C ],
      damage: 0,
      gxAttack: true,
      text: 'This attack does 50 damage to each of your opponent\'s Pokémon. If this Pokémon has at least 2 extra Energy attached to it (in addition to this attack\'s cost), heal all damage from all of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set = 'CEC';
  public setNumber = '1';
  public cardImage = 'assets/cardback.png';
  public name = 'Venusaur & Snivy-GX';
  public fullName = 'Venusaur & Snivy-GX CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterAttachEnergyFromHandEffect && effect.activePokemonAtAttachment === this) {
      const { player, target, energyCard } = effect;
      const opponent = StateUtils.getOpponent(state, player);
      const power = this.powers[0];
      const canResolve = () => {
        if (state.players[state.activePlayer] !== player
          || (state.phase !== GamePhase.PLAYER_TURN && state.phase !== GamePhase.ATTACK)
          || player.active !== target || target.getPokemonCard() !== this
          || !opponent.bench.some(slot => slot.getPokemonCard())
          || IS_ABILITY_BLOCKED(store, state, player, this)) return false;
        const provided = new CheckProvidedEnergyEffect(player, target);
        store.reduceEffect(state, provided);
        return provided.energyMap.some(entry => entry.card === energyCard
          && entry.provides.some(type => type === CardType.GRASS || type === CardType.ANY));
      };
      if (canResolve()) {
        effect.reactions.set(power.name, {
          label: power.name,
          canResolve,
          resolve: () => {
            CONFIRMATION_PROMPT(store, state, player, accepted => {
              if (!accepted || !canResolve()) return;
              store.prompt(state, new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_POKEMON_TO_SWITCH,
                PlayerType.TOP_PLAYER, [SlotType.BENCH], { allowCancel: false }), ([selected]) => {
                if (!selected || !canResolve()) return;
                const vine = new EffectOfAbilityEffect(player, power, this, selected);
                store.reduceEffect(state, vine);
                if (!vine.preventDefault && vine.target) opponent.switchPokemon(vine.target, store, state);
              });
            });
          },
        });
      }
    }

    // Solar Plant-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        const damage = new DealDamageEffect(effect, 50);
        damage.target = card;
        store.reduceEffect(state, damage);
      });

      const extraEffectCost: CardType[] = [C, C, C, C, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
          const healing = new HealEffect(player, card, card.damage);
          store.reduceEffect(state, healing);
        });
      }
    }

    return state;
  }
}