import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State } from '../../game/store/state/state';
import { AttackEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { wasAttackCancellationChecked } from '../../game/store/prefabs/attack-cancellation-scope';
import { Sandshrew } from '../set-base-set/sandshrew';
import { CobalionGX } from '../set-team-up/cobalion-gx';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { AttackAction } from '../../game/store/actions/game-actions';
import { Store } from '../../game/store/store';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { cloneAttacks, openCopyAttackSession, clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('Sand Attack cancellation and copied attack orchestration',()=>{
  beforeEach(()=>clearCopyAttackSessionsForTests());
  it('Clear Vision rejects a forbidden GX attack before a Sand Attack coin or side effects',()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Charmander BS'},deck:padDeck(10)},
      player2:{active:{card:'Mew V FST'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});
    const source=g.player2.bench[0].getPokemonCard()!;g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,source);
    g.player1.marker.addMarker(MarkerConstants.CLEAR_VISION_GX_LOCK,source);const attack={...g.player1.active.getPokemonCard()!.attacks[0],name:'Forbidden-GX',cost:[]};
    let flips=0;const prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((s:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])if(x.type==='Coin flip')flips++;return prompt(s,p,cb);});
    g.overridePrompt('Coin flip',()=>false);expect(()=>g.store.reduceEffect(g.state,new UseAttackEffect(g.player1,attack))).toThrow();expect(flips).toBe(0);
  });
  it('native Iron Rule rejects before Sand Attack flips',()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Cobalion-GX TEU'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)},
      player2:{active:{card:'Charmander BS',energy:['Water Energy SVE']},deck:padDeck(10)}});
    const source=g.player1.active.getPokemonCard() as CobalionGX;g.player2.marker.addMarker(source.IRON_RULE_MARKER,source);
    g.player2.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,g.player1.bench[0].getPokemonCard()!);
    g.state.activePlayer=1;let flips=0;const prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((s:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])if(x.type==='Coin flip')flips++;return prompt(s,p,cb);});
    g.overridePrompt('Coin flip',()=>false);expect(()=>g.store.reduceEffect(g.state,new UseAttackEffect(g.player2,g.player2.active.getPokemonCard()!.attacks[0]))).toThrow();expect(flips).toBe(0);
  });
  for(const blocked of [false,true])it('copied Iron Rule legality is evaluated once before Sand Attack, blocked='+blocked,()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},bench:[{card:'Cobalion-GX TEU'},{card:'Sandshrew BS'}],deck:padDeck(10)},
      player2:{active:{card:'Charmander BS',energy:['Water Energy SVE']},deck:padDeck(10)}});
    const copycat=g.player1.active.getPokemonCard()!,source=g.player1.bench[0].getPokemonCard() as CobalionGX,attacks=cloneAttacks(source.attacks);
    openCopyAttackSession(g.state,g.player1,copycat,source,attacks,attacks[1]);
    if(blocked)g.player2.marker.addMarker(source.IRON_RULE_MARKER,copycat);
    g.player2.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,g.player1.bench[1].getPokemonCard()!);
    g.state.activePlayer=1;let flips=0;const prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((s:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])if(x.type==='Coin flip')flips++;return prompt(s,p,cb);});
    const spy=spyOn(CobalionGX.prototype,'reduceCopiedOpponentAttackEffect').and.callThrough();g.overridePrompt('Coin flip',()=>true);
    const incoming=new UseAttackEffect(g.player2,g.player2.active.getPokemonCard()!.attacks[0]);
    if(blocked)expect(()=>g.store.reduceEffect(g.state,incoming)).toThrow();else expect(()=>g.store.reduceEffect(g.state,incoming)).not.toThrow();
    expect(flips).toBe(blocked?0:1);expect(spy.calls.all().filter(c=>c.object===copycat&&c.args[2] instanceof AttackEffect).length).toBe(1);
  });
  for(const heads of [false,true])it('direct Scratch flips exactly once, heads='+heads,()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Charmander BS',energy:['Water Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Mew V FST'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});
    const defender=g.player2.active.getPokemonCard()!;defender.hp=1000;defender.weakness=[];defender.resistance=[];
    const s=g.player2.bench[0].getPokemonCard()!;g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,s);
    const seen:string[]=[],prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((state:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])seen.push(x.type);return prompt(state,p,cb);});
    g.overridePrompt('Coin flip',()=>heads);useAttack(g.store,g.state,0,'Scratch');expect(g.player2.active.damage).toBe(heads?10:0);
    expect(seen.filter(x=>x==='Coin flip').length).toBe(1);
  });
  for(const heads of [false,true])it('Metronome flips exactly once and only chooses a copied attack on heads='+heads,()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Clefable JU',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Charmander BS'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});
    const defender=g.player2.active.getPokemonCard()!;defender.hp=1000;defender.weakness=[];defender.resistance=[];
    const s=g.player2.bench[0].getPokemonCard()!;g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,s);
    const seen:string[]=[],prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((state:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])seen.push(x.type);return prompt(state,p,cb);});
    g.overridePrompt('Coin flip',()=>heads);g.overridePrompt('Choose attack',()=>({index:0,attack:'Scratch'}));useAttack(g.store,g.state,0,'Metronome');
    expect(g.player2.active.damage).toBe(heads?10:0);expect(seen.filter(x=>x==='Coin flip').length).toBe(1);
    expect(seen.includes('Choose attack')).toBe(heads);
  });
  for(const copied of [false,true])it('a tails attack applies no heal side effect, copied='+copied,()=>{
    const g=setupGame({turn:2,
      player1:{active:{card:copied?'Clefable JU':'Mega Venusaur ex M1L',damage:50,energy:['Grass Energy SVE','Grass Energy SVE','Grass Energy SVE','Grass Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:copied?'Mega Venusaur ex M1L':'Mew V FST'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});
    const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];
    const s=g.player2.bench[0].getPokemonCard()!;g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,s);
    g.overridePrompt('Coin flip',()=>false);if(copied)g.overridePrompt('Choose attack',()=>({index:0,attack:'Jungle Dump'}));
    useAttack(g.store,g.state,0,copied?'Metronome':'Jungle Dump');expect(g.player1.active.damage).toBe(50);expect(g.player2.active.damage).toBe(0);
  });
  for(const heads of [false,true])it('resolves both simultaneous Sand Attack sources without choosing on cancellation, first heads='+heads,()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Clefable JU',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Charmander BS'},bench:[{card:'Sandshrew BS'},{card:'Sandshrew BS'}],deck:padDeck(10)}});
    const defender=g.player2.active.getPokemonCard()!;defender.hp=1000;defender.weakness=[];defender.resistance=[];
    for(const slot of g.player2.bench.slice(0,2))g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,slot.getPokemonCard()!);
    const seen:string[]=[],prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((state:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])seen.push(x.type);return prompt(state,p,cb);});
    g.overridePrompt('Coin flip',()=>heads);g.overridePrompt('Choose attack',()=>({index:0,attack:'Scratch'}));useAttack(g.store,g.state,0,'Metronome');
    expect(seen.filter(x=>x==='Coin flip').length).toBe(2);expect(seen.includes('Choose attack')).toBe(heads);expect(g.player2.active.damage).toBe(heads?10:0);
  });
  for(const sourceName of ['Flareon DEX','Hippopotas M3'])for(const copied of [false,true])for(const heads of [false,true])it(sourceName+' preflight resolves one flip, copied='+copied+', heads='+heads,()=>{
    spyOn(Math,'random').and.returnValue(heads?0:0.9);
    const g=setupGame({turn:2,player1:{active:{card:copied?'Clefable JU':'Charmander BS',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:copied?'Charmander BS':'Mew V FST'},bench:[{card:sourceName}],deck:padDeck(10)}});
    const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];
    g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,g.player2.bench[0].getPokemonCard()!);
    const events:string[]=[],prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((s:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])events.push(x.type+':'+(x as any).message);return prompt(s,p,cb);});
    if(copied)g.overridePrompt('Choose attack',()=>({index:0,attack:'Scratch'}));useAttack(g.store,g.state,0,copied?'Metronome':'Scratch');
    expect(g.player2.active.damage).toBe(heads?10:0);expect(events.filter(x=>x.includes('Coin flip animation')).length).toBe(1);
  });
  it('a deterministic Sandile blocker cancels alongside Sandshrew before copied effects',()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Clefable JU',energy:['Water Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Charmander BS'},bench:[{card:'Sandile BLW'},{card:'Sandshrew BS'}],deck:padDeck(10)}});
    const sandile=g.player2.bench[0].getPokemonCard() as any,sandshrew=g.player2.bench[1].getPokemonCard()!;
    g.player1.active.marker.addMarker(sandile.SAND_ATTACK_MARKER,sandile);g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,sandshrew);
    const seen:string[]=[],prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((s:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])seen.push(x.type);return prompt(s,p,cb);});
    g.overridePrompt('Coin flip',()=>true);g.overridePrompt('Choose attack',()=>({index:0,attack:'Scratch'}));useAttack(g.store,g.state,0,'Metronome');
    expect(g.player2.active.damage).toBe(0);expect(seen.filter(x=>x==='Coin flip').length).toBe(1);expect(seen.includes('Choose attack')).toBe(false);
  });
  for(const sandHeads of [false,true])for(const flareHeads of [false,true])it('mixed simultaneous prompt types settle before copied attack: Sandshrew='+sandHeads+', Flareon='+flareHeads,()=>{
    spyOn(Math,'random').and.returnValue(flareHeads?0:0.9);
    const g=setupGame({turn:2,player1:{active:{card:'Clefable JU',energy:['Water Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Charmander BS'},bench:[{card:'Sandshrew BS'},{card:'Flareon DEX'}],deck:padDeck(10)}});
    const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];
    for(const slot of g.player2.bench.slice(0,2))g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,slot.getPokemonCard()!);
    const events:string[]=[],prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((s:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])events.push(x.type+':'+(x as any).message);return prompt(s,p,cb);});
    g.overridePrompt('Coin flip',()=>sandHeads);g.overridePrompt('Choose attack',()=>({index:0,attack:'Scratch'}));useAttack(g.store,g.state,0,'Metronome');
    expect(g.player2.active.damage).toBe(sandHeads&&flareHeads?10:0);expect(events.filter(x=>x.startsWith('Coin flip:')).length).toBe(1);
    expect(events.filter(x=>x.includes('Coin flip animation')).length).toBe(1);expect(events.some(x=>x.startsWith('Choose attack:'))).toBe(sandHeads&&flareHeads);
  });
  for(const heads of [false,true])it('attack-owned AFTER_ATTACK helper ignores cancellation, heads='+heads,()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Squirtle RG',energy:['Water Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Mew V FST'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});
    g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,g.player2.bench[0].getPokemonCard()!);
    let flips=0;const prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((s:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])if(x.type==='Coin flip'||x.message==='Coin flip animation')flips++;return prompt(s,p,cb);});
    g.overridePrompt('Coin flip',()=>heads);useAttack(g.store,g.state,0,'Bubble');
    expect(flips).toBe(heads?2:1);
  });
  for(const heads of [false,true])it('Palkia after-attack switch only prompts when attack succeeds, heads='+heads,()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Palkia 30C',energy:['Water Energy SVE','Water Energy SVE','Water Energy SVE']},bench:[{card:'Charmander BS'}],deck:padDeck(10)},
      player2:{active:{card:'Mew V FST'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});
    g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,g.player2.bench[0].getPokemonCard()!);
    const seen:string[]=[],prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((s:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])seen.push(x.type);return prompt(s,p,cb);});
    g.overridePrompt('Coin flip',()=>heads);useAttack(g.store,g.state,0,'Wormhole');
    expect(seen.includes('Choose pokemon')).toBe(heads);
  });
  for(const heads of [false,true])it('a nested Metronome copy chain performs one attack-start flip, heads='+heads,()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Clefable JU',energy:['Water Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Clefable JU'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});
    const source=g.player2.active.getPokemonCard()!,sandshrew=g.player2.bench[0].getPokemonCard()!;
    g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,sandshrew);
    let choices=0,flips=0;const prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((s:State,p:any,cb:any):any=>{
      for(const x of Array.isArray(p)?p:[p]){if(x.type==='Coin flip')flips++;if(x.type==='Choose attack'){
        choices++;const attackIndex=choices===1?0:1;g.overridePrompt('Choose attack',()=>({index:0,attack:source.attacks[attackIndex].name}));}}
      return prompt(s,p,cb);
    });
    g.overridePrompt('Coin flip',()=>heads);useAttack(g.store,g.state,0,'Metronome');
    expect(flips).toBe(1);expect(choices).toBe(heads?2:0);
    expect(g.player1.active.marker.hasMarker((source as any).DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER,source)).toBe(heads);
  });
  it('a standalone AttackEffect still runs the legacy Sand Attack check',()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Charmander BS'},deck:padDeck(10)},player2:{active:{card:'Mew V FST'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});
    const source=g.player2.bench[0].getPokemonCard()!;g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,source);
    const attack=new AttackEffect(g.player1,g.player2,g.player1.active.getPokemonCard()!.attacks[0]);g.store.reduceEffect(g.state,attack);
    const pending=g.state.prompts.find(p=>p.type==='Coin flip'&&p.result===undefined)!;expect(pending).toBeDefined();
    (g.store as any).reducePrompt(g.state,new ResolvePromptAction(pending.id,false));expect(attack.preventDefault).toBe(true);expect(attack.damage).toBe(0);
  });
  for(const heads of [false,true])it('an attack-start restriction created by a copied Sand Attack resolves once, heads='+heads,()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)},
      player2:{active:{card:'Charmander BS',energy:['Water Energy SVE']},deck:padDeck(10)}});
    const copycat=g.player1.active.getPokemonCard()!,source=g.player1.bench[0].getPokemonCard()!,attacks=cloneAttacks(source.attacks);
    openCopyAttackSession(g.state,g.player1,copycat,source,attacks,attacks[0]);
    g.player2.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,copycat);
    g.state.activePlayer=1;const seen:string[]=[],prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((s:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])seen.push(x.type);return prompt(s,p,cb);});
    g.overridePrompt('Coin flip',()=>heads);useAttack(g.store,g.state,1,'Scratch');
    expect(g.player1.active.damage).toBe(heads?10:0);expect(seen.filter(x=>x==='Coin flip').length).toBe(1);
  });
  it('a native and copied blocker on the same marker source both preflight',()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Sandshrew BS'},bench:[{card:'Sandile BLW'}],deck:padDeck(10)},
      player2:{active:{card:'Charmander BS',energy:['Water Energy SVE']},deck:padDeck(10)}});
    const copycat=g.player1.active.getPokemonCard()!,source=g.player1.bench[0].getPokemonCard()!,attacks=cloneAttacks(source.attacks);
    openCopyAttackSession(g.state,g.player1,copycat,source,attacks,attacks[0]);
    g.player2.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,copycat);
    g.player2.active.marker.addMarker((source as any).SAND_ATTACK_MARKER,copycat);g.state.activePlayer=1;
    let flips=0;const prompt=g.store.prompt.bind(g.store);spyOn(g.store,'prompt').and.callFake((s:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])if(x.type==='Coin flip')flips++;return prompt(s,p,cb);});
    g.overridePrompt('Coin flip',()=>true);useAttack(g.store,g.state,1,'Scratch');
    expect(flips).toBe(1);expect(g.player1.active.damage).toBe(0);
  });
  for(const heads of [false,true])it('restores a serialized Sand Attack marker without duplicate checks, heads='+heads,()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Clefable JU',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Charmander BS'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});
    const source=g.player2.bench[0].getPokemonCard()!;g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,source);
    const cards=Array.from(new Set(g.state.players.flatMap(p=>[...p.active.cards,...p.bench.flatMap(slot=>slot.cards),...p.deck.cards,...p.hand.cards,...p.discard.cards,...p.prizes.flatMap(slot=>slot.cards)])));
    cards.forEach((card,index)=>card.id=index);g.state.cardNames=cards.map(card=>card.fullName);StateSerializer.setKnownCards(cards);
    const serializer=new StateSerializer(),restored=serializer.deserialize(serializer.serialize(g.state));
    const handler=(g.store as any).handler,store=new Store(handler);handler.setStore(store);store.restoreState(restored);
    const attacker=restored.players[0],defender=restored.players[1],restoredSource=defender.bench[0].getPokemonCard()!;
    expect(attacker.active.marker.hasMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,restoredSource)).toBe(true);
    const target=defender.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];
    const seen:string[]=[],prompt=store.prompt.bind(store);spyOn(store,'prompt').and.callFake((s:State,p:any,cb:any):any=>{for(const x of Array.isArray(p)?p:[p])seen.push(x.type);return prompt(s,p,cb);});
    g.overridePrompt('Coin flip',()=>heads);g.overridePrompt('Choose attack',()=>({index:0,attack:'Scratch'}));useAttack(store,restored,0,'Metronome');
    expect(defender.active.damage).toBe(heads?10:0);expect(seen.filter(x=>x==='Coin flip').length).toBe(1);expect(seen.includes('Choose attack')).toBe(heads);
  });
  it('isolates a pending attack from another Store on the same state and clears its own scope',()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Clefable JU',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Charmander BS'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});
    const source=g.player2.bench[0].getPokemonCard()!;g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,source);
    const first=new Store({onStateChange:()=>undefined});first.state=g.state;let outer:AttackEffect|undefined;
    const reduce=first.reduceEffect.bind(first);spyOn(first,'reduceEffect').and.callFake((s:State,e:any)=>{if(e instanceof AttackEffect&&!outer)outer=e;return reduce(s,e);});
    first.dispatch(new AttackAction(g.player1.id,'Metronome'));const flip=g.state.prompts.find(p=>p.type==='Coin flip'&&p.result===undefined)!;expect(flip).toBeDefined();
    first.dispatch(new ResolvePromptAction(flip.id,true));expect(outer).toBeDefined();expect(wasAttackCancellationChecked(outer!,source,Sandshrew.prototype.reduceAttackCancellationEffect)).toBe(true);
    const second=new Store({onStateChange:()=>undefined});second.state=g.state;
    const raw=new AttackEffect(g.player1,g.player2,g.player1.active.getPokemonCard()!.attacks[0]);second.reduceEffect(g.state,raw);
    expect(wasAttackCancellationChecked(raw,source,Sandshrew.prototype.reduceAttackCancellationEffect)).toBe(false);expect(g.state.prompts.filter(p=>p.type==='Coin flip'&&p.result===undefined).length).toBe(1);
    second.cleanup();expect(wasAttackCancellationChecked(outer!,source,Sandshrew.prototype.reduceAttackCancellationEffect)).toBe(true);first.cleanup();expect(wasAttackCancellationChecked(outer!,source,Sandshrew.prototype.reduceAttackCancellationEffect)).toBe(false);
  });
  it('restores transient attack scope when a handler throws',()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Charmander BS',energy:['Water Energy SVE']},deck:padDeck(10)},
      player2:{active:{card:'Mew V FST'},bench:[{card:'Sandshrew BS'}],deck:padDeck(10)}});
    const source=g.player2.bench[0].getPokemonCard()!;g.player1.active.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,source);
    const attacker=g.player1.active.getPokemonCard()!,reduce=attacker.reduceEffect.bind(attacker);let captured:AttackEffect|undefined;
    spyOn(attacker,'reduceEffect').and.callFake((store:StoreLike,state:State,effect:Effect)=>{if(effect instanceof AttackEffect){captured=effect;throw new Error('attack handler failed');}return reduce(store,state,effect);});
    g.overridePrompt('Coin flip',()=>true);expect(()=>useAttack(g.store,g.state,0,'Scratch')).toThrow();expect(captured).toBeDefined();expect(wasAttackCancellationChecked(captured!,source,Sandshrew.prototype.reduceAttackCancellationEffect)).toBe(false);
  });
});
