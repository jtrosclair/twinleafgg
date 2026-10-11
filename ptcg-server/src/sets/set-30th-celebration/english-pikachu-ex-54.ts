import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, StateUtils, AttachEnergyPrompt, EnergyCard, EnergyType, SuperType, PlayerType, SlotType, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

// Printed text: https://api.tcgdex.net/v2/en/cards/30th-054
export class EnglishPikachuEx54 extends PokemonCard {
  public stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public hp = 190;
  public cardType = CardType.LIGHTNING;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];
  public regulationMark = 'J';
  public set = '30C';
  public setNumber = '54';
  public usSetNumber = '30C 54';
  public name = 'Pikachu ex';
  public fullName = 'Pikachu ex 30C 54';
  public cardImage = 'assets/cardback.png';
  public attacks = [{
    name: 'Zip-Zap Frenzy', cost: [CardType.LIGHTNING], damage: 0,
    text: 'You may attach any number of Basic Energy cards from your hand to your Pokémon in any way you like.'
  }, {
    name: 'Thunder', cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS], damage: 200,
    text: 'This Pokémon also does 30 damage to itself.'
  }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const basic = player.hand.cards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC);
      if (basic.length === 0) { return state; }
      return store.prompt(state, new AttachEnergyPrompt(
        player.id, GameMessage.ATTACH_ENERGY_CARDS, player.hand,
        PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: basic.length, allowCancel: false,
          blocked: player.hand.cards.map((c, i) => basic.includes(c) ? -1 : i).filter(i => i !== -1) }
      ), transfers => {
        for (const transfer of transfers || []) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          store.reduceEffect(state, new AttachEnergyEffect(player, transfer.card as EnergyCard, target));
        }
      });
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const damage = new PutDamageEffect(effect, 30);
      damage.target = effect.player.active;
      store.reduceEffect(state, damage);
    }
    return state;
  }
}
