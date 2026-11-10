import type { CopiedAttackOwnershipContract } from '../../game/store/prefabs/copy-attack-delegation';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { GameMessage } from '../../game/game-message';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Cranidos extends PokemonCard implements CopiedAttackOwnershipContract {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Skull Fossil";
  public cardType: CardType = CardType.FIGHTING;
  public hp = 80;
  public weakness = [{ type: CardType.GRASS, value: 20 }];
  public retreat: CardType[] = [CardType.COLORLESS];
  public attacks = [
    { name: "Rock Smash", cost: [CardType.FIGHTING], damage: 20, damageCalculation: "+", text: "Flip a coin. If heads, this attack does 20 damage plus 20 more damage." },
    { name: "Knock Over", cost: [CardType.FIGHTING, CardType.COLORLESS], damage: 40, text: "You may discard any Stadium card in play." }
  ];
  public set = 'PL';
  public setNumber = "46";
  public cardImage = 'assets/cardback.png';
  public name = "Cranidos";
  public fullName = "Cranidos PL";

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return Cranidos.prototype.reduceCopiedAttackEffect.call(this, store, state, effect, 0);
  }

  public reduceCopiedAttackEffect(store: StoreLike, state: State, effect: Effect, _attackIndex: number): State {
    if (WAS_ATTACK_USED(effect, 0, this)) return COIN_FLIP_PROMPT(store, state, effect.player, heads => { if (heads) effect.damage += 20; });
    if (WAS_ATTACK_USED(effect, 1, this)) afterAttackDamage(state,effect,(s,next)=>{ const stadium=StateUtils.getStadiumCard(next);if(!stadium)return next; return s.prompt(next,new ConfirmPrompt(effect.player.id,GameMessage.WANT_TO_DISCARD_STADIUM),yes=>{if(!yes)return;const list=StateUtils.findCardList(next,stadium);if(!list.cards.includes(stadium))return;const owner=StateUtils.findOwner(next,list);MOVE_CARDS(s,next,list,owner.discard,{cards:[stadium],sourceCard:effect.source.getPokemonCard()||this,sourceEffect:effect});}); });
    return state;
  }
}
