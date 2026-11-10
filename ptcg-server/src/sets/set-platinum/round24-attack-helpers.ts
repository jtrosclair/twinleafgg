import { SlotType, PlayerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { SWITCH_ACTIVE_WITH_BENCHED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';

/** After the Active hit, deal printed damage to one chosen opposing Benched Pokémon. */
export function targetDamageAfter(state: State, effect: AttackEffect, amount: number): void {
  afterAttackDamage(state,effect,(store,next)=>{
    const opponent=effect.opponent, player=effect.player;
    if (!opponent.bench.some(b=>b.getPokemonCard())) return next;
    return store.prompt(next,new ChoosePokemonPrompt(player.id,GameMessage.CHOOSE_POKEMON_TO_DAMAGE,PlayerType.TOP_PLAYER,[SlotType.BENCH],{min:1,max:1,allowCancel:false}),selected=>{
      const target=selected && selected[0];
      if(!target || !target.getPokemonCard() || !opponent.bench.includes(target)) return;
      const damage=new PutDamageEffect(effect,amount);damage.target=target;store.reduceEffect(next,damage);
    });
  });
}
/** Optional switch affects only the original attacker if it remains Active. */
export function optionalSelfSwitchAfter(state: State,effect: AttackEffect): void {
 const player=effect.player,source=effect.source,attacker=source.getPokemonCard();
 afterAttackDamage(state,effect,(store,next)=>{
  if(!attacker || player.active!==source || source.getPokemonCard()!==attacker || !player.bench.some(b=>b.cards.length)) return next;
  return store.prompt(next,new ConfirmPrompt(player.id,GameMessage.WANT_TO_SWITCH_POKEMON),yes=>{
   if(yes && player.active===source && source.getPokemonCard()===attacker && player.bench.some(b=>b.cards.length)) SWITCH_ACTIVE_WITH_BENCHED(store,next,player);
  });
 });
}
/** Reduce damage using regular attack-effect reducers on each currently eligible Pokémon. */
export function healTeamAfter(state:State,effect:AttackEffect,amount:number,benchOnly:boolean):void {
 afterAttackDamage(state,effect,(store,next)=>{
  const targets=benchOnly?effect.player.bench:[effect.player.active,...effect.player.bench];
  for(const target of targets){if(!target.getPokemonCard())continue;const heal=new HealTargetEffect(effect,amount);heal.target=target;store.reduceEffect(next,heal);}
  return next;
 });
}
/** Coin event resolves after outgoing damage, preserving source tracking for recoil. */
export function coinRecoilAfter(state:State,effect:AttackEffect,amount:number):void {
 const source=effect.source,attacker=source.getPokemonCard();
 afterAttackDamage(state,effect,(store,next)=>COIN_FLIP_PROMPT(store,next,effect.player,heads=>{
  if(!heads && attacker && source.getPokemonCard()===attacker && next.players.some(p=>p.active===source || p.bench.includes(source))) recoilAfterAttack(next,effect,amount);
 }));
}
