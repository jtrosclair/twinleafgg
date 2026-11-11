import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { Card } from '../../game/store/card/card';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { padDeck,setupGame } from './test-helpers';
const rows=[
 {name:"Iono's Kilowattrel",number:'182',fullName:"Iono's Kilowattrel182 SVP"},
 {name:"Lillie's Ribombee",number:'183',fullName:"Lillie's Ribombee183 SVP"},
 {name:"Professor's Research",number:'221',fullName:"Professor's Research221 SVP"}, {name:"Professor's Research",number:'222',fullName:"Professor's Research222 SVP"}, {name:"Professor's Research",number:'223',fullName:"Professor's Research223 SVP"},
];
function serial(state:any){const all:Card[]=[];for(const player of state.players)for(const list of [player.active,...player.bench,player.deck,player.hand,player.discard,player.lostzone,player.stadium,player.supporter,...player.prizes])for(const card of list.cards)if(!all.includes(card))all.push(card);all.forEach((card,index)=>card.id=index);state.cardNames=all.map(c=>c.fullName);return new StateSerializer().serialize(state)}
describe('round33 SVP exact printed identities and legacy resolution',()=>{
 let all:Card[];beforeAll(()=>{ensureClientCards();all=CardManager.getInstance().getAllCards().slice()});afterEach(()=>StateSerializer.setKnownCards(all));
 for(const row of rows){
  for(const reversed of [false,true])it(row.name+' preserves legacy unnumbered and wrong-number lookups, reverse='+reversed,()=>{
   const ordered=reversed?all.slice().reverse():all,without=ordered.filter(c=>!rows.some(r=>r.fullName===c.fullName)),inputs=[`${row.name} SVP`,`${row.name} SVP 0`,`${row.name} SVP 999`,`${row.name.toLowerCase()} SVP 999`,`${row.name} svp 999`,`${row.name} SVP  999`,`${row.name}  SVP 999`,`${row.name}\tSVP\t999`,`${row.name} SVP 999 `,`${row.name.replace(' ','-')} SVP 999`,`${row.name.replace(' ','-')} SVP 999a`,`${row.name} SVP 999a`,`${row.name} SVP SV999`,`${row.name} PR-SV 999PH`,`${row.fullName} 999`,`${row.fullName} 999a`,` ${row.name} SVP 999`,`  ${row.name} SVP 999`,`\t${row.name} SVP 999`,`\n${row.name} SVP 999`];StateSerializer.setKnownCards(without);const before=inputs.map(x=>StateSerializer.normalizeCardName(x));StateSerializer.setKnownCards(ordered);expect(inputs.map(x=>StateSerializer.normalizeCardName(x))).toEqual(before);
   expect(StateSerializer.normalizeCardName(`${row.name} SVP ${row.number}`)).toBe(row.fullName);expect(StateSerializer.normalizeCardName(`${row.name.toLowerCase()} svp 00${row.number}`)).toBe(row.fullName);expect(StateSerializer.normalizeCardName(`${row.name.replace(/'/g,'’')} PR-SV  ${row.number}`)).toBe(row.fullName);expect(StateSerializer.normalizeCardName(`${row.name.replace(' ','-')} SVP ${row.number}`)).toBe(row.fullName);expect(StateSerializer.normalizeCardName(row.fullName)).toBe(row.fullName);expect(StateSerializer.normalizeCardName(`${row.fullName} ${row.number}`)).toBe(row.fullName);
  });
  it(row.name+' valid number cannot fall through if its exact print is absent',()=>{StateSerializer.setKnownCards(all.filter(c=>c.fullName!==row.fullName));expect(StateSerializer.normalizeCardName(`${row.name} SVP ${row.number}`)).toBe('')});
  it(row.name+' serializes and restores its own print without aliases',()=>{const game=setupGame({turn:5,player1:{active:{card:row.name==="Professor's Research"?'Charmander BS':row.fullName},hand:row.name==="Professor's Research"?[row.fullName]:[],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});StateSerializer.setKnownCards(all);const packed=serial(game.state),data=JSON.parse(packed);expect(data[1].cardNames).toContain(row.fullName);const restored=new StateSerializer().deserialize(packed);const zone=row.name==="Professor's Research"?restored.players[0].hand.cards:restored.players[0].active.cards;expect(zone.some((card:Card)=>card.fullName===row.fullName)).toBe(true)});
 }
});
