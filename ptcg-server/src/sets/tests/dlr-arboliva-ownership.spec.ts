import { CardManager } from '../../game/cards/card-manager';
import { ClientSimulator } from '../../client/simulator';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { UseAbilityAction } from '../../game/store/actions/game-actions';
import { Base64 } from '../../utils/base64';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChoosePokemonPrompt, ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { setDeltaReign } from '../set-delta-reign';
import { padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

function abilityGame(bench = true, protectedActive = false) {
  return setupGame({turn:2, player1:{active:{card:'Arboliva MEM'},deck:padDeck(12)},
    player2:{active:{card:'Mew ex MEW',tools:protectedActive ? ['Stealthy Hood UNB'] : []},
      bench:bench ? [{card:'Charmander BS'},{card:'Squirtle BS'}] : [],deck:padDeck(12)}});
}
describe('Arboliva DLR Slippery Oil and Mega Drain',()=>{
  beforeAll(()=>{const cards=CardManager.getInstance();if(!cards.isCardDefined('Arboliva MEM'))cards.defineSet(setDeltaReign);});
  it('lets the opponent choose their replacement, with a mandatory selection',()=>{
    const g=abilityGame(), original=g.player2.active.getPokemonCard(), selected=g.player2.bench[1].getPokemonCard();
    let chooser=-1, ownBench=false, mandatory=false;
    g.overridePrompt(ChoosePokemonPromptType,p=>{const prompt=p as ChoosePokemonPrompt;chooser=prompt.playerId;
      ownBench=prompt.playerType===PlayerType.BOTTOM_PLAYER;
      mandatory=prompt.options.min===1 && prompt.options.max===1 && !prompt.options.allowCancel;
      return [{player:prompt.playerId===g.player2.id?PlayerType.BOTTOM_PLAYER:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:1}];});
    useAbility(g.store,g.state,0,'Slippery Oil');
    expect(chooser).toBe(g.player2.id); expect(ownBench).toBe(true); expect(mandatory).toBe(true);
    expect(g.player2.active.getPokemonCard()).toBe(selected);expect(g.player2.bench[1].getPokemonCard()).toBe(original);
    expect(()=>useAbility(g.store,g.state,0,'Slippery Oil')).toThrow();
  });
  it('the single-player simulator resolves the opponent choice without showing the human a prompt',()=>{
    const g=abilityGame(); const state=g.state;
    for(const player of state.players) {
      for(const list of [player.active,...player.bench,player.deck,player.hand,player.discard,player.lostzone,player.stadium,player.supporter,...player.prizes]) {
        for(const card of list.cards) {card.id=state.cardNames.length;state.cardNames.push(card.fullName);}
      }
    }
    const simulator=new ClientSimulator();
    simulator.loadSnapshot({stateData:new Base64().encode(new StateSerializer().serialize(state))});
    simulator.dispatch(new UseAbilityAction(1,'Slippery Oil',{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}));
    expect(simulator.state.prompts.filter(p=>p.result===undefined).length).toBe(0);
    expect(simulator.state.players[1].active.getPokemonCard()!.name).not.toBe('Mew ex');
    simulator.cleanup();
  });
  it('cannot activate with no opposing Benched Pokémon and does not spend its marker',()=>{
    const g=abilityGame(false); const card=g.player1.active.getPokemonCard()!;
    expect(()=>useAbility(g.store,g.state,0,'Slippery Oil')).toThrow();
    expect(g.player1.marker.hasMarker('ARBOLIVA_MEM_OIL_SLIP_MARKER',card)).toBe(false);
  });
  it('does not switch an opposing Active protected by Stealthy Hood',()=>{
    const g=abilityGame(true,true), original=g.player2.active.getPokemonCard();let prompted=false;
    g.overridePrompt(ChoosePokemonPromptType,()=>{prompted=true;return [{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}];});
    useAbility(g.store,g.state,0,'Slippery Oil');
    expect(g.player2.active.getPokemonCard()).toBe(original);expect(prompted).toBe(false);
    expect(()=>useAbility(g.store,g.state,0,'Slippery Oil')).toThrow();
  });
  for(const copied of [false,true]) it((copied?'copied ':'direct ')+'Mega Drain damages the opponent and heals its user',()=>{
    const g=setupGame({turn:2,player1:{active:{card:copied?'Mew ex 30C':'Arboliva MEM',energy:['Grass Energy SVE','Grass Energy SVE'],damage:60},
      bench:copied?[{card:'Arboliva MEM'}]:[],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}});
    const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];
    if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:'Mega Drain'}));useAbility(g.store,g.state,0,'Memory Helix');}
    else useAttack(g.store,g.state,0,'Mega Drain');
    expect(g.player2.active.damage).toBe(100);expect(g.player1.active.damage).toBe(30);
  });
  it('Genome Hacking copies opposing Mega Drain and heals Mew',()=>{
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW',energy:['Psychic Energy SVE','Psychic Energy SVE','Psychic Energy SVE'],damage:60},deck:padDeck(12)},
      player2:{active:{card:'Arboliva MEM'},deck:padDeck(12)}});
    const target=g.player2.active.getPokemonCard()!;target.hp=1000;target.weakness=[];target.resistance=[];
    g.overridePrompt('Choose attack',()=>({index:0,attack:'Mega Drain'}));useAttack(g.store,g.state,0,'Genome Hacking');
    expect(g.player2.active.damage).toBe(100);expect(g.player1.active.damage).toBe(30);
  });
});
