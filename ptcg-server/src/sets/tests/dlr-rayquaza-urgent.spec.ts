import { getCardByName,padDeck,setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';
import { PlayCardAction,PlayerType,SlotType } from '../../game/store/actions/play-card-action';
import { ChooseCardsPromptType,ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { CardList } from '../../game/store/state/card-list';
import { State, GamePhase, GameWinner } from '../../game/store/state/state';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';
import { SHUFFLE_CARDS_TO_BOTTOM } from '../../game/store/prefabs/shuffle-cards-to-bottom';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { StateUtils } from '../../game/store/state-utils';
import { CardType } from '../../game/store/card/card-types';
import { BotArbiter, BotFlipMode, BotShuffleMode } from '../../game/bots/bot-arbiter';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { MegaRayquazaex } from '../set-delta-reign/mega-rayquaza-ex';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
describe('Mega Rayquaza ex DLR 84 urgent audit',()=>{
 it('registers the requested English print and artwork',()=>{
  const c=getCardByName('Mega Rayquaza ex DLR');expect([c.name,c.set,c.setNumber,c.usSetNumber]).toEqual(['Mega Rayquaza ex','DLR','84','DLR 84']);expect(c.cardImage).toContain('/DLR/DLR_084_');
 });
 for(const accept of [false,true]) it(`on Bench Ability ${accept?'attaches a revealed Basic Energy and shuffles the remainder':'can be declined'}`,()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:['Mega Rayquaza ex DLR'],deck:['Fire Energy SVE','Water Energy SVE','Lightning Energy SVE','Ralts SIT','Psychic Energy SVE']},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  g.overridePrompt('Confirm',()=>accept);let selected=false;
  if(accept) g.overridePrompt(ChooseCardsPromptType,p=>{selected=true;expect((p as ChooseCardsPrompt).options.min).toBe(1);return [0];});
  const index=g.player1.hand.cards.findIndex(c=>c.fullName==='Mega Rayquaza ex DLR');
  g.store.dispatch(new PlayCardAction(g.player1.id,index,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}));
  expect(selected).toBe(accept);expect(g.player1.bench[0].cards.some(c=>c.fullName==='Fire Energy SVE')).toBe(accept);
  expect(g.player1.deck.cards.length).toBe(accept?4:5);
 });
 it('uses a count-specific replayable shuffle without changing the original deck size',()=>{
  const g=setupGame({player1:{active:{card:'Mew ex MEW'},deck:padDeck(9)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(9)}});
  const p=new ShuffleDeckPrompt(g.player1.id,3);
  for(const [mode,order] of [[BotShuffleMode.NO_SHUFFLE,[0,1,2]],[BotShuffleMode.REVERSE,[2,1,0]]] as const) {
   const result=new BotArbiter({flipMode:BotFlipMode.ALL_HEADS,shuffleMode:mode}).resolvePrompt(g.state,p)!;
   expect(result.result).toEqual(order);expect(p.validate(result.result,g.state)).toBe(true);
  }
  expect(p.validate([0,1,2,3],g.state)).toBe(false);
 });
 it('counts allied Fire and Lightning Energy across Active and Bench, but not opponent or Water',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mega Rayquaza ex DLR',energy:['Fire Energy SVE','Lightning Energy SVE','Water Energy SVE']},bench:[{card:'Mew ex MEW',energy:['Fire Energy SVE','Lightning Energy SVE']}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW',energy:['Fire Energy SVE']},deck:padDeck(10)}});
  g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];g.player2.active.getPokemonCard()!.resistance=[];
  useAttack(g.store,g.state,0,'Storm Emerald');expect(g.player2.active.damage).toBe(200);
 });
 it('copying Storm Emerald counts the attacking player’s Energy',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex 30C',energy:['Fire Energy SVE','Lightning Energy SVE','Water Energy SVE']},bench:[{card:'Mega Rayquaza ex DLR',energy:['Fire Energy SVE']}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];g.player2.active.getPokemonCard()!.resistance=[];
  g.overridePrompt('Choose attack',()=>({index:0,attack:'Storm Emerald'}));useAbility(g.store,g.state,0,'Memory Helix');expect(g.player2.active.damage).toBe(150);
 });
 it('Typhlosion Blazing Energy transforms Rapid Strike Energy into two Fire Energy',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mega Rayquaza ex DLR',energy:['Fire Energy SVE','Lightning Energy SVE','Water Energy SVE']},bench:[{card:'Typhlosion LOT'},{card:'Rapid Strike Urshifu V BST',energy:['Rapid Strike Energy BST']}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  useAbility(g.store,g.state,0,'Blazing Energy');const check=new CheckProvidedEnergyEffect(g.player1,g.player1.bench[1]);g.store.reduceEffect(g.state,check);
  const attack=new AttackEffect(g.player1,g.player2,g.player1.active.getPokemonCard()!.attacks[0]);g.store.reduceEffect(g.state,attack);
  expect(check.energyMap.some(e=>e.provides.includes(CardType.FIRE))).toBe(true);expect(attack.damage).toBe(250);
  expect(StateUtils.checkEnoughEnergy(check.energyMap,[CardType.FIRE,CardType.FIRE])).toBe(true);expect(StateUtils.checkEnoughEnergy(check.energyMap,[CardType.WATER])).toBe(false);
 });
 it('Typhlosion’s existing Ability changes allied basic Energy queries, expires, and leaves opponent Energy alone',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW',energy:['Water Energy SVE']},bench:[{card:'Typhlosion LOT'}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW',energy:['Water Energy SVE']},deck:padDeck(10)}});
  const provided=(player:typeof g.player1)=>{const q=new CheckProvidedEnergyEffect(player,player.active);g.store.reduceEffect(g.state,q);return q.energyMap;};
  expect(provided(g.player1)[0].provides).toEqual([CardType.WATER]);useAbility(g.store,g.state,0,'Blazing Energy');
  expect(provided(g.player1)[0].provides).toEqual([CardType.FIRE]);expect(provided(g.player2)[0].provides).toEqual([CardType.WATER]);
  expect(StateUtils.checkEnoughEnergy(provided(g.player1),[CardType.FIRE])).toBe(true);
  g.store.reduceEffect(g.state,new EndTurnEffect(g.player1));expect(provided(g.player1)[0].provides).toEqual([CardType.WATER]);
 });
 it('Rapid Strike Energy supplies two Energy for its existing mixed attack costs',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Rapid Strike Urshifu V BST',energy:['Rapid Strike Energy BST']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  const q=new CheckProvidedEnergyEffect(g.player1,g.player1.active);g.store.reduceEffect(g.state,q);
  expect(StateUtils.checkEnoughEnergy(q.energyMap,[CardType.WATER,CardType.FIGHTING])).toBe(true);
 });

 it('shuffles only the looked-at remainder according to the recorded prompt result',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:['Mega Rayquaza ex DLR'],deck:['Fire Energy SVE','Water Energy SVE','Lightning Energy SVE','Ralts SIT','Psychic Energy SVE']},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  g.overridePrompt('Confirm',()=>true);g.overridePrompt(ChooseCardsPromptType,()=>[0]);let promptCount=0;
  g.overridePrompt('Shuffle deck',prompt=>{promptCount++;expect((prompt as ShuffleDeckPrompt).count).toBe(3);return [2,1,0];});
  g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}));
  expect(promptCount).toBe(1);expect(g.player1.deck.cards.map(c=>c.fullName)).toEqual(['Psychic Energy SVE','Ralts SIT','Lightning Energy SVE','Water Energy SVE']);
 });

 it('replaying a recorded subset shuffle action yields the same board and deck',()=>{
  const build=()=>{
   const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:['Mega Rayquaza ex DLR'],deck:['Fire Energy SVE','Water Energy SVE','Lightning Energy SVE','Ralts SIT','Psychic Energy SVE']},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
   g.overridePrompt('Confirm',()=>true);g.overridePrompt(ChooseCardsPromptType,()=>[0]);
   const h=(g.store as any).handler, original=h.onStateChange.bind(h);
   const spy=spyOn(h,'onStateChange').and.callFake((state:any)=>{if(state.prompts.some((p:any)=>p.type==='Shuffle deck'&&p.result===undefined))return;original(state);});
   g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}));
   const prompt=g.state.prompts.find(p=>p.type==='Shuffle deck'&&p.result===undefined)!;expect(prompt).toBeDefined();spy.and.callThrough();return {g,prompt};
  };
  const first=build(), action=new ResolvePromptAction(first.prompt.id,[2,1,0]);first.g.store.dispatch(action);
  const second=build();expect(second.prompt.id).toBe(action.id);second.g.store.dispatch(action);
  expect(second.g.player1.deck.cards.map(c=>c.fullName)).toEqual(first.g.player1.deck.cards.map(c=>c.fullName));
  expect(second.g.player1.bench[0].cards.map(c=>c.fullName)).toEqual(first.g.player1.bench[0].cards.map(c=>c.fullName));
 });

 for(const copied of [false,true]) it(`subset helper preserves ${copied?'copied':'direct'} attack attribution and untouched deck`,()=>{
  const g=setupGame({turn:3,player1:{active:{card:copied?'Mew ex 30C':'Mega Rayquaza ex DLR'},bench:copied?[{card:'Mega Rayquaza ex DLR'}]:[],deck:['Fire Energy SVE','Water Energy SVE','Ralts SIT','Psychic Energy SVE']},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  const source=(copied?g.player1.bench[0]:g.player1.active).getPokemonCard()!;
  const attack=new AttackEffect(g.player1,g.player2,source.attacks[0]),actor=g.player1.active.getPokemonCard()!,cards=new CardList();g.player1.deck.moveTo(cards,3);
  let moved:MoveCardsEffect|undefined;const original=g.store.reduceEffect.bind(g.store);
  spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof MoveCardsEffect&&e.source===cards)moved=e;return original(state,e);});
  g.overridePrompt('Shuffle deck',()=>[2,1,0]);SHUFFLE_CARDS_TO_BOTTOM(g.store,g.state,g.player1,cards,actor,attack);(g.store as any).handler.onStateChange(g.state);
  expect(moved).toBeDefined();expect(moved!.sourceEffect).toBe(attack);expect(moved!.sourceCard).toBe(actor);
  expect(g.player1.deck.cards.map(c=>c.fullName)).toEqual(['Psychic Energy SVE','Ralts SIT','Water Energy SVE','Fire Energy SVE']);
 });
 for(const prizes of [3,6]) it(`Mega Rayquaza awards three Prizes and ${prizes===3?'wins at zero Prizes':'continues with three left'}`,()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mega Rayquaza ex DLR',energy:['Fire Energy SVE','Lightning Energy SVE','Fire Energy SVE','Fire Energy SVE','Fire Energy SVE','Fire Energy SVE']},prizeCount:prizes,deck:padDeck(10)},player2:{active:{card:'Mega Rayquaza ex DLR'},bench:[{card:'Mew ex MEW'}],deck:padDeck(10)}});
  g.player2.active.getPokemonCard()!.weakness=[];g.player2.active.getPokemonCard()!.resistance=[];useAttack(g.store,g.state,0,'Storm Emerald');
  expect(g.player1.prizes.filter(slot=>slot.cards.length>0).length).toBe(prizes-3);
  if(prizes===3){expect(g.state.phase).toBe(GamePhase.FINISHED);expect(g.state.winner).toBe(GameWinner.PLAYER_1);} else expect(g.state.phase).not.toBe(GamePhase.FINISHED);
 });

 it('attachment observers run after the rest of Ruler’s Roar has been shuffled to the bottom',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:['Mega Rayquaza ex DLR'],deck:['Fire Energy SVE','Water Energy SVE','Lightning Energy SVE','Ralts SIT','Psychic Energy SVE']},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  g.overridePrompt('Confirm',()=>true);g.overridePrompt(ChooseCardsPromptType,()=>[0]);g.overridePrompt('Shuffle deck',()=>[2,1,0]);
  let observed:string[]|undefined;const original=g.store.reduceEffect.bind(g.store);
  spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof AttachEnergyEffect)observed=g.player1.deck.cards.map(c=>c.fullName);return original(state,e);});
  g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}));
  expect(observed).toEqual(['Psychic Energy SVE','Ralts SIT','Lightning Energy SVE','Water Energy SVE']);
 });
 it('Genome Hacking copies Storm Emerald using the attacker’s Energy rather than the source’s',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW',energy:['Fire Energy SVE','Lightning Energy SVE','Water Energy SVE']},bench:[{card:'Mew ex 30C',energy:['Fire Energy SVE']}],deck:padDeck(10)},player2:{active:{card:'Mega Rayquaza ex DLR',energy:['Lightning Energy SVE']},deck:padDeck(10)}});
  g.overridePrompt('Choose attack',()=>({index:0,attack:'Storm Emerald'}));useAttack(g.store,g.state,0,'Genome Hacking');expect(g.player2.active.damage).toBe(150);
 });

 it('Temple of Sinnoh removes Rapid Strike Energy’s blended colors and its second unit',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Rapid Strike Urshifu V BST',energy:['Rapid Strike Energy BST']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  g.player1.stadium.cards.push(getCardByName('Temple of Sinnoh ASR'));
  const q=new CheckProvidedEnergyEffect(g.player1,g.player1.active);g.store.reduceEffect(g.state,q);
  expect(q.energyMap[0].provides).toEqual([CardType.COLORLESS]);
  expect(StateUtils.checkEnoughEnergy(q.energyMap,[CardType.WATER])).toBe(false);
  expect(StateUtils.checkEnoughEnergy(q.energyMap,[CardType.COLORLESS,CardType.COLORLESS])).toBe(false);
 });

 it('Ruler’s Roar never emits a phantom attachment when moving the Energy is prevented',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:['Mega Rayquaza ex DLR'],deck:['Fire Energy SVE','Water Energy SVE','Lightning Energy SVE','Ralts SIT','Psychic Energy SVE']},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  g.overridePrompt('Confirm',()=>true);g.overridePrompt(ChooseCardsPromptType,()=>[0]);let attachments=0;const original=g.store.reduceEffect.bind(g.store);
  spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{
   if(e instanceof MoveCardsEffect && e.destination===g.player1.bench[0] && e.cards?.some(c=>c.fullName==='Fire Energy SVE')) {e.preventDefault=true;return state;}
   if(e instanceof AttachEnergyEffect) attachments++;return original(state,e);
  });
  g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}));
  expect(attachments).toBe(0);expect(g.player1.bench[0].cards.some(c=>c.fullName==='Fire Energy SVE')).toBe(false);
  expect(g.player1.deck.cards.some(c=>c.fullName==='Fire Energy SVE')).toBe(true);
 });

 it('Ruler’s Roar handles fewer than four cards with no Basic Energy',()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mew ex MEW'},hand:['Mega Rayquaza ex DLR'],deck:['Ralts SIT','Mew ex MEW','Ralts SIT']},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
  let choices=0,shuffles=0;g.overridePrompt('Confirm',()=>true);g.overridePrompt(ChooseCardsPromptType,()=>{choices++;return [];});g.overridePrompt('Shuffle deck',()=>{shuffles++;return [2,1,0];});
  g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}));
  expect(choices).toBe(0);expect(shuffles).toBe(1);expect(g.player1.deck.cards.length).toBe(3);expect(g.player1.bench[0].cards.length).toBe(1);
 });

 for(const [rule,winner] of [[{cardsInDeck:10},GameWinner.PLAYER_1],[{cardsInDeck:9},GameWinner.PLAYER_2],[{mustLose:true},GameWinner.PLAYER_2],[{selfDeckOut:true},GameWinner.PLAYER_2]] as const) it(`Rayquaza’s three-Prize Knock Out preserves puzzle win override ${JSON.stringify(rule)}`,()=>{
  const g=setupGame({turn:3,player1:{active:{card:'Mega Rayquaza ex DLR',energy:['Fire Energy SVE','Lightning Energy SVE','Fire Energy SVE','Fire Energy SVE','Fire Energy SVE','Fire Energy SVE']},prizeCount:3,deck:padDeck(10)},player2:{active:{card:'Mega Rayquaza ex DLR'},bench:[{card:'Mew ex MEW'}],deck:padDeck(10)}});
  g.state.winConditions=rule;g.player2.active.getPokemonCard()!.weakness=[];g.player2.active.getPokemonCard()!.resistance=[];useAttack(g.store,g.state,0,'Storm Emerald');
  expect(g.state.phase).toBe(GamePhase.FINISHED);expect(g.state.winner).toBe(winner);
 });

 it('the old upstream M6 alias resolves to the base English printing even with another same-name print first',()=>{
  const base=new MegaRayquazaex(),alternate=new MegaRayquazaex();alternate.fullName='Mega Rayquaza ex SIR DLR';alternate.setNumber='138';
  StateSerializer.setKnownCards([alternate,base]);
  expect(StateSerializer.normalizeCardName('Mega Rayquaza ex M6')).toBe('Mega Rayquaza ex DLR');
  expect(StateSerializer.normalizeCardName('Mega Rayquaza ex M6 58')).toBe('Mega Rayquaza ex DLR');
 });

});
