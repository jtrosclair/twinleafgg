import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { CardType, PowerType, State } from '../../game';
import { AttackAction, PassTurnAction } from '../../game/store/actions/game-actions';
import { CheckAttackCostEffect, CheckPokemonIntrinsicPowersEffect, CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GamePhase } from '../../game/store/state/state';
import { Simisage } from '../set-paradox-rift/simisage';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

const grass='Grass Energy SVE', lightning='Lightning Energy SVE', psychic='Psychic Energy SVE';
const protection='SIMISAGE_PAR_ARM_THRUST_NEEDLE_MARKER';
const clear='SIMISAGE_PAR_CLEAR_ARM_THRUST_NEEDLE_MARKER';
function game(copied=false, attacker='Rotom VSTAR CRZ 46', energy=[lightning,lightning]) {
  const g=setupGame({turn:5,player1:{active:{card:copied?'Mew ex 30C':'Simisage PAR',energy:[grass,grass,grass]},bench:copied?[{card:'Simisage PAR'},{card:'Mew ex MEW'}]:[{card:'Mew ex MEW'}],deck:padDeck(16)},player2:{active:{card:attacker,energy},deck:padDeck(16)}});
  const all=Array.from(new Set(g.state.players.flatMap(player=>[player.active,...player.bench,player.hand,player.deck,player.discard,player.lostzone,player.stadium,player.supporter,...player.prizes].flatMap(list=>list.cards))));
  all.forEach((card,index)=>card.id=index);g.state.cardNames=all.map(card=>card.fullName);return g;
}
function protect(g:ReturnType<typeof game>,copied=false) {
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Arm Thrust Needle'}));useAbility(g.store,g.state,0,'Memory Helix');}
  else useAttack(g.store,g.state,0,'Arm Thrust Needle');
  expect(g.store.state.activePlayer).toBe(1);
}
function attackAgain(g:ReturnType<typeof game>,name='Scrap Pulse') {useAttack(g.store,g.store.state,1,name);}
function restore(g:ReturnType<typeof game>):State {
  StateSerializer.setKnownCards(CardManager.getInstance().getAllCards());
  const serializer=new StateSerializer();const loaded=serializer.deserialize(serializer.serialize(g.store.state));
  g.store.restoreState(loaded);return loaded;
}

describe('Simisage PAR: isolated intrinsic Ability query and attack-owned lifecycle',()=>{
  it('matches printed stats and full identity',()=>{
    const c=new Simisage();expect([c.hp,c.set,c.setNumber,c.name,c.fullName,c.regulationMark]).toEqual([100,'PAR','5','Simisage','Simisage PAR','G']);expect(c.weakness).toEqual([{type:CardType.FIRE}]);expect(c.attacks[0].damage).toBe(100);
  });
  it('real Monkey Trio permits Arm Thrust Needle with only Grass',()=>{
    const g=setupGame({turn:5,player1:{active:{card:'Simisage PAR',energy:[grass]},bench:[{card:'Simisear DAA'},{card:'Simipour DAA'}],deck:padDeck(12)},player2:{active:{card:'Rotom VSTAR CRZ 46'},deck:padDeck(12)}});
    useAttack(g.store,g.state,0,'Arm Thrust Needle');expect(g.player2.active.damage).toBe(100);
  });
  it('does not discount without all three exact names',()=>{
    const g=setupGame({turn:5,player1:{active:{card:'Simisage PAR',energy:[grass]},bench:[{card:'Simisear V BRS 27'},{card:'Simipour DAA'}],deck:padDeck(12)},player2:{active:{card:'Rotom VSTAR CRZ 46'},deck:padDeck(12)}});
    expect(()=>useAttack(g.store,g.state,0,'Arm Thrust Needle')).toThrow();expect(g.player2.active.damage).toBe(0);
  });
  it('discounts Colorless only and never mutates printed attack costs',()=>{
    const g=setupGame({turn:5,player1:{active:{card:'Simisage PAR'},bench:[{card:'Simisear DAA'},{card:'Simipour DAA'}],deck:padDeck(12)},player2:{active:{card:'Rotom VSTAR CRZ 46'},deck:padDeck(12)}});
    const c=g.player1.active.getPokemonCard()!; const cost=new CheckAttackCostEffect(g.player1,{name:'Different usable attack',cost:[CardType.LIGHTNING,CardType.COLORLESS,CardType.COLORLESS],damage:0,text:''});
    g.store.reduceEffect(g.state,cost);expect(cost.cost).toEqual([CardType.LIGHTNING]);expect(c.attacks[0].cost).toEqual([CardType.GRASS,CardType.COLORLESS,CardType.COLORLESS]);
  });
  it('Garbotoxin removes Monkey Trio cost reduction',()=>{
    const g=setupGame({turn:5,player1:{active:{card:'Simisage PAR',energy:[grass]},bench:[{card:'Simisear DAA'},{card:'Simipour DAA'}],deck:padDeck(12)},player2:{active:{card:'Rotom VSTAR CRZ 46'},bench:[{card:'Garbodor DRX',tools:['Big Charm SSH']}],deck:padDeck(12)}});
    expect(()=>useAttack(g.store,g.state,0,'Arm Thrust Needle')).toThrow();expect(g.player2.active.damage).toBe(0);
  });
  it('does not transfer Monkey Trio to a real copied attacker',()=>{
    const g=setupGame({turn:5,player1:{active:{card:'Mew ex 30C',energy:[grass]},bench:[{card:'Simisage PAR'},{card:'Simisear DAA'},{card:'Simipour DAA'}],deck:padDeck(12)},player2:{active:{card:'Rotom VSTAR CRZ 46'},deck:padDeck(12)}});
    g.overridePrompt('Choose attack',()=>({index:0,attack:'Arm Thrust Needle'}));expect(()=>useAbility(g.store,g.state,0,'Memory Helix')).toThrow();expect(g.player2.active.damage).toBe(0);
  });
  for(const copied of [false,true])it((copied?'copied':'direct')+' protection blocks actual Scrap Pulse, owns marker and expires after next turn',()=>{
    const g=game(copied);const user=g.player1.active.getPokemonCard()!;const source=copied?g.player1.bench[0].getPokemonCard()!:user;protect(g,copied);
    expect(g.player1.active.marker.hasMarker(protection,user)).toBe(true);expect(g.player2.marker.hasMarker(clear,user)).toBe(true);
    if(copied){expect(g.player1.bench[0].marker.hasMarker(protection,source)).toBe(false);expect(user.powers.map(p=>p.name)).toEqual(['Memory Helix']);}
    attackAgain(g);expect(g.player1.active.damage).toBe(0);expect(g.player1.active.marker.hasMarker(protection,user)).toBe(false);expect(g.player2.marker.hasMarker(clear,user)).toBe(false);
    g.store.dispatch(new PassTurnAction(g.player1.id));attackAgain(g);expect(g.player1.active.damage).toBe(80);
  });
  for(const copied of [false,true])it((copied?'copied':'direct')+' protection survives actual serializer roundtrip and restores copy checkpoint',()=>{
    const g=game(copied);protect(g,copied);const loaded=restore(g);const user=loaded.players[0].active.getPokemonCard()!;
    expect(loaded.players[0].active.marker.hasMarker(protection,user)).toBe(true);if(copied)expect(loaded.copiedAttackCheckpoints!.length).toBeGreaterThan(0);
    attackAgain(g);expect(loaded.players[0].active.damage).toBe(0);expect(loaded.players[0].active.marker.hasMarker(protection,user)).toBe(false);
  });
  it('plain attacker can deal damage; non-damaging effects are not blocked',()=>{
    const g=game(false,'Mew V FST',[psychic,psychic]);protect(g);g.overridePrompt('Confirm',()=>false);attackAgain(g,'Psychic Leap');expect(g.player1.active.damage).toBe(70);
  });
  for(const tool of ['Forest Seal Stone SIT','Sky Seal Stone CRZ'])it('a Tool usable Ability does not make the Pokémon have an Ability: '+tool,()=>{
    const g=game(false,'Mew V FST',[psychic,psychic]);g.player2.active.tools.push(getCardByName(tool));const c=g.player2.active.getPokemonCard()!;
    const before=JSON.stringify(c.powers);const query=new CheckPokemonIntrinsicPowersEffect(g.player2,c);g.store.reduceEffect(g.state,query);expect(query.powers).toEqual([]);expect(JSON.stringify(c.powers)).toBe(before);
    protect(g);g.overridePrompt('Confirm',()=>false);attackAgain(g,'Psychic Leap');expect(g.player1.active.damage).toBe(70);
  });
  it('a used VSTAR Ability still counts although real use is illegal',()=>{
    const g=game();g.player2.usedVSTAR=true;protect(g);const c=g.player2.active.getPokemonCard()!;expect(()=>g.store.reduceEffect(g.state,new PowerEffect(g.player2,c.powers[0],c))).toThrow();attackAgain(g);expect(g.player1.active.damage).toBe(0);
  });
  it('protection is attack-owned even when its own Monkey Trio is removed',()=>{
    const g=game(false,'Garbodor DRX',['Psychic Energy SVE','Psychic Energy SVE',grass]);g.player2.active.tools.push(getCardByName('Big Charm SSH'));protect(g);
    const own=new CheckPokemonIntrinsicPowersEffect(g.player1,g.player1.active.getPokemonCard()!);g.store.reduceEffect(g.state,own);expect(own.powers).toEqual([]);
    attackAgain(g,'Sludge Toss');expect(g.player1.active.damage).toBe(0);
  });
  for(const removal of ['Garbotoxin','Path to the Peak'])it(removal+' removes the attacker Ability and allows real Scrap Short damage',()=>{
    const g=game(false,'Rotom V LOR');if(removal==='Garbotoxin')g.player1.bench[1].cards.push(getCardByName('Garbodor DRX'));if(removal==='Garbotoxin')g.player1.bench[1].tools.push(getCardByName('Big Charm SSH'));
    if(removal==='Path to the Peak')g.player1.stadium.cards.push(getCardByName('Path to the Peak CRE'));
    protect(g);g.overridePrompt('Choose cards',()=>[]);attackAgain(g,'Scrap Short');expect(g.player1.active.damage).toBe(40);
  });
  it('any Simisage is excepted even though it has Monkey Trio',()=>{
    const g=game(false,'Simisage PAR',[grass,grass,grass]);g.player1.active.tools.push(getCardByName('Big Charm SSH'));g.player2.active.tools.push(getCardByName('Big Charm SSH'));protect(g);attackAgain(g,'Arm Thrust Needle');expect(g.player1.active.damage).toBe(100);
  });
  it('real Severe Poison effect is retained; protection does not block damage counters in checkup',()=>{
    const g=game(false,'Galarian Weezing SHF',['Darkness Energy SVE']);protect(g);attackAgain(g,'Severe Poison');expect(g.player1.active.damage).toBe(40);
  });
  it('damage counters are not ordinary attack damage',()=>{
    const g=game();protect(g);const a=new AttackEffect(g.player2,g.player1,g.player2.active.getPokemonCard()!.attacks[0]);const counters=new PutCountersEffect(a,20);g.store.reduceEffect(g.state,counters);expect(g.player1.active.damage).toBe(20);
  });
  it('does not throw on a detached source target diagnostic',()=>{
    const g=game();protect(g);const a=new AttackEffect(g.player2,g.player1,g.player2.active.getPokemonCard()!.attacks[0]);g.player2.active.cards=[];const damage=new PutDamageEffect(a,20);expect(()=>g.store.reduceEffect(g.state,damage)).not.toThrow();
  });
  it('reset to the pre-attack canonical state removes copied protection and stale sessions',()=>{
    const g=game(true);StateSerializer.setKnownCards(CardManager.getInstance().getAllCards());const serializer=new StateSerializer();const initial=serializer.serialize(g.state);protect(g,true);g.store.restoreState(serializer.deserialize(initial));
    const s=g.store.state;expect(s.players[0].active.marker.markers.length).toBe(0);expect(s.copiedAttackCheckpoints).toBeUndefined();g.store.dispatch(new PassTurnAction(s.players[0].id));attackAgain(g);expect(s.players[0].active.damage).toBe(80);
  });
  it('intrinsic query does not mutate gained Unown powers on repeated queries',()=>{
    const g=game(false,'Unown VSTAR SIT',[psychic,grass,grass]);const c=g.player2.active.getPokemonCard()!;g.state.activePlayer=1;useAttack(g.store,g.state,1,'Star Cipher');
    const before=JSON.stringify(c.powers);for(let i=0;i<3;i++){const q=new CheckPokemonIntrinsicPowersEffect(g.player2,c);g.store.reduceEffect(g.state,q);expect(q.powers.some(p=>p.powerType===PowerType.ABILITY)).toBe(true);}expect(JSON.stringify(c.powers)).toBe(before);
  });
  for(const copied of [false,true])it((copied?'copied':'direct')+' switching out clears protection even when the same Pokémon returns',()=>{
    const g=game(copied);protect(g,copied);const target=g.player1.active.getPokemonCard()!;const bench=copied?1:0;
    g.player1.switchPokemon(g.player1.bench[bench]);g.player1.switchPokemon(g.player1.bench[bench]);expect(g.player1.active.getPokemonCard()).toBe(target);expect(g.player1.active.marker.hasMarker(protection,target)).toBe(false);attackAgain(g);expect(g.player1.active.damage).toBe(80);
  });
  it('copied protection survives removal of the original benched Simisage',()=>{
    const g=game(true);protect(g,true);const source=g.player1.bench[0].getPokemonCard()!;g.player1.bench[0].moveTo(g.player1.discard);expect(g.player1.discard.cards).toContain(source);attackAgain(g);expect(g.player1.active.damage).toBe(0);
  });
  it('an old Pokémon Power is not a modern Ability',()=>{
    const g=game(false,'Alakazam BS',[psychic,psychic,psychic]);g.player2.active.tools.push(getCardByName('Big Charm SSH'));protect(g);attackAgain(g,'Shadow Punch');expect(g.player1.active.damage).toBe(30);
  });

});
