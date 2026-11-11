import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, CardType, SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { State, GamePhase } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { Store } from '../../game/store/store';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { Klefki } from '../set-scarlet-and-violet/klefki';
import { MegaDiancieex } from '../set-phantasmal-flames/mega-diancie-ex';
import { Crustle } from '../set-destined-rivals/crustle';
import { Dipplin } from '../set-twilight-masquerade/dipplin';
import { Giratina } from '../set-lost-thunder/giratina';
import { Eevee } from '../set-surging-sparks/eevee';
import { Mew } from '../set-unbroken-bonds/mew';
import { Gardevoirex } from '../set-scarlet-and-violet/gardevoir-ex';
import { Miraidonex } from '../set-scarlet-and-violet/miraidon-ex';
import { BruteBonnet } from '../set-paradox-rift/brute-bonnet';
import { Marshadow } from '../set-unbroken-bonds/marshadow';
import { Goldeen } from '../set-twilight-masquerade/goldeen';
import { FlutterMane } from '../set-temporal-forces/flutter-mane';
import { MegaRayquazaex } from '../set-delta-reign/mega-rayquaza-ex';
import { VolcanionEX } from '../set-steam-siege/volcanion-ex';
import { KlefkiSV } from '../set-paldean-fates/shiny-vault';
import { MegaDiancieexASC } from '../set-ascended-heroes/other-prints';
import { DipplinPRE, GoldeenPRE, FlutterManePRE } from '../set-prismatic-evolution/alt-arts';
import { DipplinIR } from '../set-twilight-masquerade/other-prints';
import { GiratinaSMP, MewSMP } from '../set-sun-and-moon-promos/other-prints';
import { GardevoirexFA, MiraidonexFA } from '../set-scarlet-and-violet/full-art';
import { BruteBonnetIR } from '../set-paradox-rift/full-art';
import { MegaRayquazaexSIR } from '../set-delta-reign/other-pokemon-prints';
import { VolcanionEXXYP } from '../set-x-and-y-promos/other-prints';

class Dummy extends PokemonCard {public name='Dummy';public fullName='Dummy TEST';public hp=500;public set='TEST';}
class AbilityDummy extends Dummy {public powers=[{name:'Example Ability',powerType:PowerType.ABILITY,text:''}];}
class Energy extends EnergyCard {public name='Energy';public fullName='Energy TEST';public set='TEST';public provides=[CardType.GRASS];}
class Tool extends TrainerCard {public name='Tool';public fullName='Tool TEST';public set='TEST';public trainerType=TrainerType.TOOL;}
class Stadium extends TrainerCard {public name='Festival Grounds';public fullName='Festival Grounds TEST';public set='TEST';public trainerType=TrainerType.STADIUM;}
function battle(card:PokemonCard,copied:boolean){
 const state=new State(),player=new Player(),opponent=new Player(),mew=new Mewex();player.id=1;opponent.id=2;state.players=[player,opponent];
 state.turn=2;state.activePlayer=0;state.phase=GamePhase.ATTACK;player.active.cards=[copied?mew:card];opponent.active.cards=[new Dummy()];
 const store=new Store({onStateChange:()=>undefined});store.state=state;const attacks=copied?cloneAttacks(card.attacks):card.attacks;
 if(copied)openCopyAttackSession(state,player,mew,card,attacks,attacks[0]);
 return {state,player,opponent,store,card,mew,attack:new AttackEffect(player,opponent,attacks[0]),copied};
}
type Battle=ReturnType<typeof battle>;
function disable(b:Battle){const reduce=b.store.reduceEffect.bind(b.store);spyOn(b.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof PowerEffect)throw new Error('Ability disabled');return reduce(s,e);});}
function resolve(b:Battle,result:any){const p=b.state.prompts.filter(x=>x.result===undefined).pop();if(!p)throw new Error('Expected prompt');(b.store as any).reducePrompt(b.state,new ResolvePromptAction(p.id,result));}
function energy(slot:PokemonCardList,type:CardType=CardType.GRASS){const e=new Energy();e.provides=[type];slot.cards.push(e);slot.energies.cards.push(e);return e;}
function bench(player:Player){const slot=new PokemonCardList();slot.cards=[new Dummy()];player.bench.push(slot);return slot;}
const target=(index=0,slot:SlotType=SlotType.ACTIVE)=>({player:PlayerType.TOP_PLAYER,slot,index});

interface Case {name:string;create:()=>PokemonCard;prepare?:(b:Battle)=>void;verify:(b:Battle,blocked:boolean)=>void;}
const cases:Case[]=[
 {name:'Klefki Joust',create:()=>new Klefki(),prepare:b=>{b.opponent.active.tools.push(new Tool());},verify:b=>{expect(b.opponent.active.tools.length).toBe(0);expect(b.opponent.discard.cards.some(c=>c instanceof Tool)).toBe(true);}},
 {name:'Mega Diancie Garland Ray',create:()=>new MegaDiancieex(),prepare:b=>{energy(b.player.active);},verify:b=>{const e=b.player.active.energies.cards[0];resolve(b,[{from:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0},card:e}]);expect(b.attack.damage).toBe(120);expect(b.player.discard.cards).toContain(e);}},
 {name:'Crustle Great Scissors',create:()=>new Crustle(),verify:b=>expect(b.opponent.active.damage).toBe(120)},
 {name:'Dipplin Do the Wave',create:()=>new Dipplin(),prepare:b=>{bench(b.player);bench(b.player);b.player.stadium.cards=[new Stadium()];},verify:(b,blocked)=>{expect(b.attack.damage).toBe(40);expect((b.attack.attack as any).barrage).toBe(!b.copied&&!blocked);}},
 {name:'Giratina Shadow Impact',create:()=>new Giratina(),verify:b=>{resolve(b,[b.player.active]);expect(b.player.active.damage).toBe(40);}},
 {name:'Eevee Reckless Charge',create:()=>new Eevee(),verify:b=>expect(b.player.active.damage).toBe(10)},
 {name:'Mew Psypower',create:()=>new Mew(),verify:b=>{resolve(b,[{target:target(),damage:30}]);expect(b.opponent.active.damage).toBe(30);}},
 {name:'Gardevoir Miracle Force',create:()=>new Gardevoirex(),prepare:b=>{b.player.active.specialConditions=[SpecialCondition.POISONED];},verify:b=>expect(b.player.active.specialConditions.length).toBe(0)},
 ...[
  ['Miraidon Photon Blaster',()=>new Miraidonex()],['Brute Bonnet Rampaging Hammer',()=>new BruteBonnet()],['Volcanion Volcanic Heat',()=>new VolcanionEX()]
 ].map(([name,create])=>({name:name as string,create:create as ()=>PokemonCard,verify:(b:Battle)=>expect(b.player.active.cannotAttackNextTurnPending).toBe(true)})),
 {name:'Marshadow Red Knuckles',create:()=>new Marshadow(),prepare:b=>{(b.opponent.active.cards[0] as PokemonCard).tags=[CardTag.ULTRA_BEAST];},verify:b=>expect(b.attack.damage).toBe(70)},
 {name:'Goldeen Whirlpool',create:()=>new Goldeen(),prepare:b=>{energy(b.opponent.active);b.player.stadium.cards=[new Stadium()];},verify:(b,blocked)=>{const e=b.opponent.active.energies.cards[0];resolve(b,true);resolve(b,[e]);expect(b.opponent.discard.cards).toContain(e);expect((b.attack.attack as any).barrage).toBe(!b.copied&&!blocked?true:undefined);}},
 {name:'Flutter Mane Hex Hurl',create:()=>new FlutterMane(),prepare:b=>{bench(b.opponent);},verify:b=>{resolve(b,[{target:target(0,SlotType.BENCH),damage:20}]);expect(b.opponent.bench[0].damage).toBe(20);}},
 {name:'Mega Rayquaza Storm Emerald',create:()=>new MegaRayquazaex(),prepare:b=>{energy(b.player.active,CardType.FIRE);energy(b.player.active,CardType.LIGHTNING);},verify:b=>expect(b.attack.damage).toBe(100)}
];
describe('puzzle-prioritized copied attack ownership batch 4',()=>{
 beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const c of cases)for(const copied of [false,true])for(const blocked of [false,true])it(c.name+', copied='+copied+', Ability disabled='+blocked,()=>{
   const b=battle(c.create(),copied);c.prepare?.(b);if(blocked)disable(b);b.store.reduceEffect(b.state,b.attack);c.verify(b,blocked);
 });
 for(const [base,create] of [
  ['Klefki Joust',()=>new KlefkiSV()],['Mega Diancie Garland Ray',()=>new MegaDiancieexASC()],
  ['Dipplin Do the Wave',()=>new DipplinPRE()],['Dipplin Do the Wave',()=>new DipplinIR()],
  ['Giratina Shadow Impact',()=>new GiratinaSMP()],['Mew Psypower',()=>new MewSMP()],
  ['Gardevoir Miracle Force',()=>new GardevoirexFA()],['Miraidon Photon Blaster',()=>new MiraidonexFA()],
  ['Brute Bonnet Rampaging Hammer',()=>new BruteBonnetIR()],['Goldeen Whirlpool',()=>new GoldeenPRE()],
  ['Flutter Mane Hex Hurl',()=>new FlutterManePRE()],['Mega Rayquaza Storm Emerald',()=>new MegaRayquazaexSIR()],
  ['Volcanion Volcanic Heat',()=>new VolcanionEXXYP()]
 ] as Array<[string,()=>PokemonCard]>)for(const copied of [false,true])it(base+' alternate print preserves attack and identity, copied='+copied,()=>{
   const source=create(),name=source.fullName,c=cases.find(x=>x.name===base)!,b=battle(source,copied);c.prepare?.(b);b.store.reduceEffect(b.state,b.attack);c.verify(b,false);expect(source.fullName).toBe(name);
 });
 for(const [name,create] of [['Miraidon',()=>new Miraidonex()],['Brute Bonnet',()=>new BruteBonnet()],['Volcanion',()=>new VolcanionEX()]] as Array<[string,()=>PokemonCard]>)
 for(const copied of [false,true])it(name+' next-turn attack restriction survives and expires, copied='+copied,()=>{
   const b=battle(create(),copied);b.store.reduceEffect(b.state,b.attack);b.state.phase=GamePhase.FINISHED;b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.active.cannotAttackNextTurn).toBe(true);
   b.state.activePlayer=1;b.state.phase=GamePhase.FINISHED;b.store.reduceEffect(b.state,new EndTurnEffect(b.opponent));expect(b.player.active.cannotAttackNextTurn).toBe(true);
   b.state.activePlayer=0;b.state.phase=GamePhase.PLAYER_TURN;let message='';try{b.store.reduceEffect(b.state,new UseAttackEffect(b.player,b.attack.attack));}catch(e){message=(e as any).message;}
   expect(message).toBe('BLOCKED_BY_EFFECT');b.state.phase=GamePhase.FINISHED;b.store.reduceEffect(b.state,new EndTurnEffect(b.player));expect(b.player.active.cannotAttackNextTurn).toBe(false);
 });
 it('Mega Diancie ability reduces incoming damage only for its actual holder and when enabled',()=>{
   for(const mode of ['direct','copied','disabled']){const b=battle(new MegaDiancieex(),mode==='copied');if(mode==='disabled')disable(b);
     const attack=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:100,text:''}),hit=new PutDamageEffect(attack,100);b.store.reduceEffect(b.state,hit);expect(hit.damage).toBe(mode==='direct'?70:100);}
 });
 it('Crustle ability blocks opposing ex damage only for its actual holder and when enabled',()=>{
   for(const mode of ['direct','copied','disabled']){const b=battle(new Crustle(),mode==='copied');(b.opponent.active.cards[0] as PokemonCard).tags=[CardTag.POKEMON_ex];if(mode==='disabled')disable(b);
     const attack=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:100,text:''}),hit=new PutDamageEffect(attack,100);b.store.reduceEffect(b.state,hit);expect(hit.preventDefault).toBe(mode==='direct');}
 });
 it('Mew Bench Barrier remains on the original and respects suppression',()=>{
   for(const mode of ['direct','copied','disabled']){const b=battle(new Mew(),mode==='copied'),target=bench(b.player);if(mode==='disabled')disable(b);
     const attack=new AttackEffect(b.opponent,b.player,{name:'Hit',cost:[],damage:100,text:''}),hit=new PutDamageEffect(attack,100);hit.target=target;b.store.reduceEffect(b.state,hit);expect(hit.preventDefault).toBe(mode==='direct');}
 });
 for(const [name,create] of [['Klefki',()=>new Klefki()],['Flutter Mane',()=>new FlutterMane()]] as Array<[string,()=>PokemonCard]>)it(name+' suppresses the opposing Ability only when it is the active source and enabled',()=>{
   for(const mode of ['direct','copied','disabled']){const b=battle(create(),mode==='copied'),foe=new AbilityDummy();b.opponent.active.cards=[foe];
     if(mode==='disabled'){const reduce=b.store.reduceEffect.bind(b.store);spyOn(b.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof PowerEffect&&e.card===b.card)throw new Error('Ability disabled');return reduce(s,e);});}
     const invoke=()=>b.store.reduceEffect(b.state,new PowerEffect(b.opponent,foe.powers[0],foe));if(mode==='direct')expect(invoke).toThrow();else expect(invoke).not.toThrow();}
 });
 for(const copied of [false,true])it('Goldeen Whirlpool has no choice or barrage change without a defending Energy, copied='+copied,()=>{
   const b=battle(new Goldeen(),copied);b.player.stadium.cards=[new Stadium()];b.store.reduceEffect(b.state,b.attack);
   expect(b.state.prompts.length).toBe(0);expect((b.attack.attack as any).barrage).toBeUndefined();
 });
});
