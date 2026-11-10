import { CardTag, CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AttachEnergyEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { CardList } from '../../game/store/state/card-list';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { SHUFFLE_CARDS_TO_BOTTOM } from '../../game/store/prefabs/shuffle-cards-to-bottom';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { GameMessage } from '../../game/game-message';
import { IS_ABILITY_BLOCKED, IS_SPECIAL_ENERGY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaRayquazaex extends PokemonCard {
  public stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = C;
  public hp = 280;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];
  public powers = [{ name: "Ruler's Roar", powerType: PowerType.ABILITY,
    text: 'Once during your turn, when you play this Pokémon from your hand onto your Bench, you may use this Ability. Look at the top 4 cards of your deck and attach a Basic Energy card you find there to this Pokémon. Shuffle the other cards and put them on the bottom of your deck.' }];
  public attacks = [{ name: 'Storm Emerald', cost: [R, L, C], damage: 50, damageCalculation: 'x',
    text: 'This attack does 50 damage for each [R] Energy and each [L] Energy attached to all of your Pokémon.' }];
  public regulationMark = 'J';
  public set = 'DLR';
  public setNumber = '84';
  public cardImage = 'https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/DLR/DLR_084_R_EN.png';
  public name = 'Mega Rayquaza ex';
  public fullName = 'Mega Rayquaza ex DLR';
  public usSetNumber = 'DLR 84';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-rebel-clash/eldegoss-v.ts (on-bench Ability); upstream d4d90492a.
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this &&
      effect.player.hand.cards.includes(this) && effect.player.bench.includes(effect.target) && effect.target.cards.length === 0) {
      const player = effect.player;
      if (player.deck.cards.length === 0 || IS_ABILITY_BLOCKED(store, state, player, this)) return state;
      return store.prompt(state, new ConfirmPrompt(player.id, GameMessage.WANT_TO_USE_ABILITY), want => {
        if (!want) return;
        const top = new CardList();
        MOVE_CARDS(store, state, player.deck, top, { count: Math.min(4, player.deck.cards.length), sourceCard: this, sourceEffect: this.powers[0] });
        store.prompt(state, new ShowCardsPrompt(player.id, GameMessage.CARDS_SHOWED_BY_EFFECT, top.cards), () => {
          if (!top.cards.some(card => card instanceof EnergyCard && card.energyType === EnergyType.BASIC)) {
            SHUFFLE_CARDS_TO_BOTTOM(store, state, player, top, this, this.powers[0]);
            return;
          }
          store.prompt(state, new ChooseCardsPrompt(player, GameMessage.CHOOSE_CARD_TO_ATTACH, top,
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { min: 1, max: 1, allowCancel: false }), cards => {
            const energy = (cards || [])[0] as EnergyCard | undefined;
            if (energy) {
              MOVE_CARDS(store, state, top, effect.target, { cards: [energy], sourceCard: this, sourceEffect: this.powers[0] });
            }
            // Attachment triggers wait until the entire Ability, including
            // the required subset shuffle, is finished (2026 sequencing).
            SHUFFLE_CARDS_TO_BOTTOM(store, state, player, top, this, this.powers[0], () => {
              if (energy && effect.target.cards.includes(energy)) store.reduceEffect(state, new AttachEnergyEffect(player, energy, effect.target, 'deck'));
            });
          });
        });
      });
    }

    // Ref: set-black-and-white/mandibuzz.ts (energy-count damage).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      let total = 0;
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, slot => {
        const check = new CheckProvidedEnergyEffect(effect.player, slot);
        store.reduceEffect(state, check);
        const cards = Array.from(new Set(check.energyMap.map(entry => entry.card)));
        for (const card of cards) {
          const entries = check.energyMap.filter(entry => entry.card === card);
          const matching = (type: CardType) => type === CardType.FIRE || type === CardType.LIGHTNING || type === CardType.ANY;
          const energy = card as EnergyCard;
          const blocked = check.specialEnergiesProvideColorless ||
            (energy.energyType === EnergyType.SPECIAL && IS_SPECIAL_ENERGY_BLOCKED(store, state, effect.player, energy, slot));
          if (!blocked && check.energyTypeOverride === undefined && energy.blendedEnergies?.length) {
            if (energy.blendedEnergies.some(matching)) total += energy.blendedEnergyCount || 1;
          } else {
            // Multiple rows can refer to one physical card; count units once.
            total += Math.max(0, ...entries.map(entry => entry.provides.filter(matching).length));
          }
        }
      });
      effect.damage = total * 50;
    }
    return state;
  }

}
