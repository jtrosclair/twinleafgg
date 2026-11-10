import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { State, GamePhase } from '../../game/store/state/state';
import { COPY_OPPONENTS_LAST_ATTACK } from '../../game/store/prefabs/prefabs';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';
import { useAbility } from './card-test-helpers';
import { CardType } from '../../game/store/card/card-types';
import { Store } from '../../game/store/store';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { GameMessage } from '../../game/game-message';
import { AttackAction } from '../../game/store/actions/game-actions';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { afterAttackDamage, beginAttackDamageScope, finishAttackDamageScope } from '../../game/store/prefabs/attack-after-damage';

describe('Goldeen Take Down timing', () => {
  it('does not gain Hustle Belt from self-damage dealt after its main damage', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP',damage:20,energy:['Water Energy SVE','Water Energy SVE'],tools:['Hustle Belt CES']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    useAttack(g.store,g.state,0,'Take Down');
    expect(g.player1.active.damage).toBe(30);
    expect(g.player2.active.damage).toBe(30);
  });
  it('keeps the same timing for a copied attack', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW',damage:140,tools:['Hustle Belt CES']},deck:padDeck(10)},player2:{active:{card:'Goldeen DP'},deck:padDeck(10)}});
    const source=g.player2.active.getPokemonCard()!;
    g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[1]};
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    expect(g.player1.active.damage).toBe(150); expect(g.player2.active.damage).toBe(30);
  });
  it('still damages the attacker when the opponent prevents outgoing damage', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    g.player2.active.preventDamageNextTurn=true; useAttack(g.store,g.state,0,'Take Down');
    expect(g.player1.active.damage).toBe(10); expect(g.player2.active.damage).toBe(0);
  });
  it('damages the original attacker even if a damage reaction switches it out', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP',energy:['Water Energy SVE','Water Energy SVE']},bench:[{card:'Squirtle BS'}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const oldSlot=g.player1.active, nextSlot=g.player1.bench[0], reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{
      const result=reduce(s,e);
      if(e instanceof AfterDamageEffect && e.target===g.player2.active) g.player1.switchPokemon(nextSlot);
      return result;
    });
    useAttack(g.store,g.state,0,'Take Down');
    expect(oldSlot.damage).toBe(10); expect(nextSlot.damage).toBe(0); expect(g.player2.active.damage).toBe(30);
  });
  it('keeps copied self-damage even when the original attacker is in the Lost Zone', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},deck:padDeck(10)},player2:{active:{card:'Goldeen DP'},deck:padDeck(10)}});
    const source=g.player2.active.getPokemonCard()!;
    g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[1]};
    g.player2.active.moveTo(g.player2.lostzone);g.player2.active.cards=[getCardByName('Squirtle BS')];
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    expect(g.player1.active.damage).toBe(10); expect(g.player2.active.damage).toBe(30);
  });
  it('does not apply Weakness or Resistance to self-damage', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    g.player1.active.getPokemonCard()!.weakness=[{type:CardType.WATER}];
    useAttack(g.store,g.state,0,'Take Down');
    expect(g.player1.active.damage).toBe(10); expect(g.player2.active.damage).toBe(30);
  });
  it('does not damage a replacement that occupies the vacated original slot', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const old=g.player1.active, attacker=old.getPokemonCard()!, reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{
      const result=reduce(s,e);
      if(e instanceof AfterDamageEffect && e.target===g.player2.active && old.cards.includes(attacker)) {
        old.moveTo(g.player1.discard); old.clearEffects(); old.damage=0; old.cards=[getCardByName('Squirtle BS')];
      }
      return result;
    });
    useAttack(g.store,g.state,0,'Take Down');
    expect(g.player1.discard.cards).toContain(attacker); expect(old.damage).toBe(0);
    expect(g.player2.active.damage).toBe(30);
  });
  it('does not damage a slot removed from play during the attack', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP',energy:['Water Energy SVE','Water Energy SVE']},bench:[{card:'Squirtle BS'}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const source=g.player1.active, replacement=g.player1.bench[0], reduce=g.store.reduceEffect.bind(g.store);
    spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{
      const result=reduce(s,e);
      if(e instanceof AfterDamageEffect && e.target===g.player2.active && g.player1.active===source) {
        g.player1.switchPokemon(replacement);
        g.player1.bench.splice(g.player1.bench.indexOf(source),1);
      }
      return result;
    });
    expect(()=>useAttack(g.store,g.state,0,'Take Down')).not.toThrow();
    expect(source.damage).toBe(0); expect(replacement.damage).toBe(0);
    expect(g.player2.active.damage).toBe(30);
  });
  it('resolves self-knockout after dealing the opponent damage', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP',damage:50,energy:['Water Energy SVE','Water Energy SVE']},bench:[{card:'Squirtle BS'}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const attacker=g.player1.active.getPokemonCard()!;
    useAttack(g.store,g.state,0,'Take Down');
    expect(g.player2.active.damage).toBe(30);
    expect(g.player1.discard.cards).toContain(attacker);
    expect(g.player2.getPrizeLeft()).toBe(5);
  });
  it('applies both damage results before resolving simultaneous knockouts', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP',damage:50,energy:['Water Energy SVE','Water Energy SVE']},bench:[{card:'Squirtle BS'}],deck:padDeck(10)},player2:{active:{card:'Squirtle BS',damage:10},bench:[{card:'Squirtle BS'}],deck:padDeck(10)}});
    const attacker=g.player1.active.getPokemonCard()!, defender=g.player2.active.getPokemonCard()!;
    useAttack(g.store,g.state,0,'Take Down');
    expect(g.player1.discard.cards).toContain(attacker); expect(g.player2.discard.cards).toContain(defender);
    expect(g.player1.getPrizeLeft()).toBe(5); expect(g.player2.getPrizeLeft()).toBe(5);
  });
  it('waits for a pending damage reaction before applying self-damage', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const store=new Store({onStateChange:()=>undefined}); store.state=g.state;
    const reduce=store.reduceEffect.bind(store); let prompted=false, confirmed=false;
    spyOn(store,'reduceEffect').and.callFake((s:State,e:Effect)=>{
      const result=reduce(s,e);
      if(!prompted && e instanceof AfterDamageEffect && e.target===g.player2.active) {
        prompted=true; store.prompt(s,new ConfirmPrompt(g.player1.id,GameMessage.WANT_TO_USE_ABILITY),()=>{confirmed=true;});
      }
      return result;
    });
    store.dispatch(new AttackAction(g.player1.id,'Take Down'));
    const animation=g.state.prompts.find(p=>p instanceof WaitPrompt && p.result===undefined)!;
    expect(animation).toBeDefined(); store.dispatch(new ResolvePromptAction(animation.id,null));
    expect(g.player2.active.damage).toBe(30); expect(g.player1.active.damage).toBe(0);
    const confirm=g.state.prompts.find(p=>p instanceof ConfirmPrompt && p.result===undefined)!;
    expect(confirm).toBeDefined(); store.dispatch(new ResolvePromptAction(confirm.id,true));
    expect(confirmed).toBe(true); expect(g.player1.active.damage).toBe(10);
  });
  it('applies self-damage through Mew Memory Helix copied attack', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex 30C',energy:['Water Energy SVE','Water Energy SVE']},bench:[{card:'Goldeen DP'}],deck:padDeck(10)},player2:{active:{card:'Squirtle BS'},deck:padDeck(10)}});
    g.overridePrompt('Choose attack',()=>({index:0,attack:'Take Down'}));
    useAbility(g.store,g.state,0,'Memory Helix');
    expect(g.player1.active.damage).toBe(10); expect(g.player2.active.damage).toBe(30);
  });
  [false,true].forEach(opponentsLostZone => {
    it('uses Goldeen effects from ' + (opponentsLostZone ? 'the opposing' : 'its own') + ' Lost Zone with Mew Lost Link', () => {
      const g=setupGame({turn:2,player1:{active:{card:'Mew TM',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Squirtle BS'},deck:padDeck(10)}});
      const source=getCardByName('Goldeen DP');
      (opponentsLostZone ? g.player2 : g.player1).lostzone.cards.push(source);
      g.overridePrompt('Choose attack',()=>({index:0,attack:'Take Down'}));
      useAbility(g.store,g.state,0,'Lost Link');
      expect(g.player1.active.damage).toBe(10); expect(g.player2.active.damage).toBe(30);
    });
  });
  it('chooses the correct attack source when both Lost Zones contain Pokémon', () => {
    spyOn(Math, 'random').and.returnValue(0.1);
    const g=setupGame({turn:2,player1:{active:{card:'Mew TM',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    g.player1.lostzone.cards.push(getCardByName('Goldeen DP'));
    g.player2.lostzone.cards.push(getCardByName('Skorupi DP'));
    g.overridePrompt('Choose attack',()=>({index:1,attack:'Pin Missile'}));
    useAbility(g.store,g.state,0,'Lost Link');
    expect(g.player1.active.damage).toBe(0); expect(g.player2.active.damage).toBe(40);
  });
  it('applies self-damage through legacy Foul Play', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Krookodile BLW',energy:['Darkness Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Goldeen DP'},deck:padDeck(10)}});
    g.overridePrompt('Choose attack',()=>({index:0,attack:'Take Down'}));
    useAttack(g.store,g.state,0,'Foul Play');
    expect(g.player1.active.damage).toBe(10); expect(g.player2.active.damage).toBe(30);
  });
  it('applies self-damage through Clefable Metronome', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Clefable JU',energy:['Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Goldeen DP'},deck:padDeck(10)}});
    g.overridePrompt('Choose attack',()=>({index:0,attack:'Take Down'}));
    useAttack(g.store,g.state,0,'Metronome');
    expect(g.player1.active.damage).toBe(10); expect(g.player2.active.damage).toBe(30);
  });
  it('applies self-damage through Mew P5 Copy', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew P5',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Goldeen DP'},deck:padDeck(10)}});
    g.overridePrompt('Choose attack',()=>({index:0,attack:'Take Down'}));
    useAttack(g.store,g.state,0,'Copy');
    expect(g.player1.active.damage).toBe(10); expect(g.player2.active.damage).toBe(30);
  });
  it('applies copied self-damage after Skill Copy discards its selected Pokémon', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Alakazam Star CG',energy:['Water Energy SVE','Water Energy SVE','Water Energy SVE']},hand:['Goldeen DP'],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const copied=g.player1.hand.cards[0], reduce=g.store.reduceEffect.bind(g.store); let discardedBeforeSelfDamage=false;
    spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{
      if(e instanceof AfterDamageEffect && e.target===g.player1.active) discardedBeforeSelfDamage=g.player1.discard.cards.includes(copied);
      return reduce(s,e);
    });
    g.overridePrompt('Choose attack',()=>({index:0,attack:'Take Down'}));
    useAttack(g.store,g.state,0,'Skill Copy');
    expect(g.player1.active.damage).toBe(10); expect(g.player2.active.damage).toBe(30);
    expect(discardedBeforeSelfDamage).toBe(true);
  });
  it('applies copied self-damage even when the defender prevents its damage', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Clefable JU',energy:['Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Goldeen DP'},deck:padDeck(10)}});
    g.player2.active.preventDamageNextTurn=true;
    g.overridePrompt('Choose attack',()=>({index:0,attack:'Take Down'}));
    useAttack(g.store,g.state,0,'Metronome');
    expect(g.player1.active.damage).toBe(10); expect(g.player2.active.damage).toBe(0);
  });
  it('does not leak a deferred effect from an aborted attack into a retry', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const reduce=g.store.reduceEffect.bind(g.store); let reject=true;
    spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{
      const result=reduce(s,e);
      if(reject && e instanceof AttackEffect && e.attack.name==='Take Down') {
        reject=false; throw new Error('Attack rejected after propagation');
      }
      return result;
    });
    expect(()=>useAttack(g.store,g.state,0,'Take Down')).toThrow();
    const restored=g.store.state;
    expect(restored.players[0].active.damage).toBe(0);
    useAttack(g.store,restored,0,'Take Down');
    expect(restored.players[0].active.damage).toBe(10);
    expect(restored.players[1].active.damage).toBe(30);
  });
  it('runs the self-damage once for each separate attack', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    useAttack(g.store,g.state,0,'Take Down');
    g.state.phase=GamePhase.PLAYER_TURN; g.state.activePlayer=0; g.state.turn+=2;
    useAttack(g.store,g.state,0,'Take Down');
    expect(g.player1.active.damage).toBe(20); expect(g.player2.active.damage).toBe(60);
  });
  it('keeps nested attack scopes independent', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP'},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const attack=g.player1.active.getPokemonCard()!.attacks[1], calls: string[]=[];
    const outer=beginAttackDamageScope(g.state), outerEffect=new AttackEffect(g.player1,g.player2,attack);
    afterAttackDamage(g.state,outerEffect,(_store,state)=>{calls.push('outer');return state;});
    const inner=beginAttackDamageScope(g.state), innerEffect=new AttackEffect(g.player1,g.player2,attack);
    afterAttackDamage(g.state,innerEffect,(_store,state)=>{calls.push('inner');return state;});
    expect(finishAttackDamageScope(()=>undefined,g.store,g.state,inner).next().done).toBe(true);
    expect(calls).toEqual(['inner']);
    expect(finishAttackDamageScope(()=>undefined,g.store,g.state,outer).next().done).toBe(true);
    expect(calls).toEqual(['inner','outer']);
  });
  it('resolves newly scheduled effects on the same attack in FIFO order', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP'},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const effect=new AttackEffect(g.player1,g.player2,g.player1.active.getPokemonCard()!.attacks[1]);
    const scope=beginAttackDamageScope(g.state), calls:string[]=[];
    afterAttackDamage(g.state,effect,(_store,state)=>{
      calls.push('first');
      afterAttackDamage(state,effect,(_nextStore,nextState)=>{calls.push('third');return nextState;});
      return state;
    });
    afterAttackDamage(g.state,effect,(_store,state)=>{calls.push('second');return state;});
    expect(finishAttackDamageScope(()=>undefined,g.store,g.state,scope).next().done).toBe(true);
    expect(calls).toEqual(['first','second','third']);
  });
  it('drains work rescheduled on an earlier attack by a later copied effect', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP'},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    const attack=g.player1.active.getPokemonCard()!.attacks[1], calls:string[]=[];
    const scope=beginAttackDamageScope(g.state), first=new AttackEffect(g.player1,g.player2,attack), second=new AttackEffect(g.player1,g.player2,attack);
    afterAttackDamage(g.state,first,(_store,state)=>{calls.push('first');return state;});
    afterAttackDamage(g.state,second,(_store,state)=>{
      calls.push('second');
      afterAttackDamage(state,first,(_nextStore,nextState)=>{calls.push('first again');return nextState;});
      return state;
    });
    expect(finishAttackDamageScope(()=>undefined,g.store,g.state,scope).next().done).toBe(true);
    expect(calls).toEqual(['first','second','first again']);
  });
  [false,true].forEach(restore => {
    it('discards pending attack work on Store ' + (restore ? 'restore' : 'cleanup'), () => {
      const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP'},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const scope=beginAttackDamageScope(g.state), effect=new AttackEffect(g.player1,g.player2,g.player1.active.getPokemonCard()!.attacks[1]);
      let called=false;
      afterAttackDamage(g.state,effect,(_store,state)=>{called=true;return state;});
      if(restore) g.store.restoreState(g.state); else g.store.cleanup();
      expect(finishAttackDamageScope(()=>undefined,g.store,g.state,scope).next().done).toBe(true);
      expect(called).toBe(false);
    });
  });
  it('applies self-damage through legacy Assist copying a Benched card', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Liepard BLW',energy:['Darkness Energy SVE']},bench:[{card:'Goldeen DP'}],deck:padDeck(10)},player2:{active:{card:'Squirtle BS'},deck:padDeck(10)}});
    g.overridePrompt('Choose attack',()=>({index:0,attack:'Take Down'}));
    useAttack(g.store,g.state,0,'Assist');
    expect(g.player1.active.damage).toBe(10); expect(g.player2.active.damage).toBe(30);
  });
  it('round-trips the stable result without persisting executable callbacks', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Goldeen DP',energy:['Water Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    useAttack(g.store,g.state,0,'Take Down');
    const cards=g.state.players.flatMap(player=>[
      ...player.active.cards, ...player.bench.flatMap(slot=>slot.cards), ...player.hand.cards, ...player.deck.cards,
      ...player.discard.cards, ...player.lostzone.cards, ...player.prizes.flatMap(prize=>prize.cards)
    ]);
    cards.forEach((card,index)=>{card.id=index;}); g.state.cardNames=cards.map(card=>card.fullName);
    StateSerializer.setKnownCards(cards);
    const serializer=new StateSerializer(), serialized=serializer.serialize(g.state), restored=serializer.deserialize(serialized);
    expect(restored.players[0].active.damage).toBe(10); expect(restored.players[1].active.damage).toBe(30);
    expect(serialized).not.toContain('afterAttackDamage');
    const restoredStore=new Store({onStateChange:()=>undefined}); restoredStore.restoreState(restored);
    expect(restored.players[0].active.damage).toBe(10); expect(restored.players[1].active.damage).toBe(30);
  });
});
