import { getCardByName } from './test-helpers';

type Expected = { fullName:string;set:string;number:string;name:string;hp?:number;stage?:number;type?:number;retreat?:number;regulationMark?:string;evolvesFrom?:string;attacks?:Array<{name:string;damage:number;cost:number[]}>;powers?:string[];text?:string };
const expected:Expected[] = [
  {
    "fullName": "Iono's Kilowattrel182 SVP",
    "set": "SVP",
    "number": "182",
    "name": "Iono's Kilowattrel",
    "hp": 120,
    "stage": 3,
    "type": 4,
    "retreat": 1,
    "regulationMark": "I",
    "evolvesFrom": "Iono's Wattrel",
    "attacks": [
      {
        "name": "Mach Bolt",
        "damage": 70,
        "cost": [
          4,
          9,
          9
        ]
      }
    ],
    "powers": [
      "Flashing Draw"
    ]
  },
  {
    "fullName": "Lillie's Ribombee183 SVP",
    "set": "SVP",
    "number": "183",
    "name": "Lillie's Ribombee",
    "hp": 70,
    "stage": 3,
    "type": 5,
    "retreat": 0,
    "regulationMark": "I",
    "evolvesFrom": "Lillie's Cutiefly",
    "attacks": [
      {
        "name": "Magical Shot",
        "damage": 50,
        "cost": [
          5
        ]
      }
    ],
    "powers": [
      "Inviting Wink"
    ]
  },
  {
    "fullName": "Professor's Research221 SVP",
    "set": "SVP",
    "number": "221",
    "name": "Professor's Research",
    "regulationMark": "G",
    "text": "Discard your hand and draw 7 cards."
  }
];
describe('round33 exact printed metadata',()=>{
 it('prerelease prints retain the printed weakness, resistance and owner tags',()=>{
  const kilowattrel:any=getCardByName("Iono's Kilowattrel182 SVP"),ribombee:any=getCardByName("Lillie's Ribombee183 SVP");
  expect(kilowattrel.weakness).toEqual([{type:4}]);expect(kilowattrel.resistance).toEqual([{type:6,value:-30}]);expect(kilowattrel.tags).toContain("Iono's");
  expect(ribombee.weakness).toEqual([{type:8}]);expect(ribombee.resistance).toEqual([]);expect(ribombee.tags).toContain("Lillie's");
 });
 for(const e of expected)it(e.fullName,()=>{
  const c:any=getCardByName(e.fullName);expect(c.set).toBe(e.set);expect(c.setNumber).toBe(e.number);expect(c.name).toBe(e.name);
  if(e.hp!==undefined)expect(c.hp).toBe(e.hp);if(e.stage!==undefined)expect(c.stage).toBe(e.stage);if(e.type!==undefined)expect(c.cardType).toBe(e.type);
  if(e.retreat!==undefined)expect(c.retreat.length).toBe(e.retreat);if(e.regulationMark!==undefined)expect(c.regulationMark).toBe(e.regulationMark);if(e.evolvesFrom!==undefined)expect(c.evolvesFrom).toBe(e.evolvesFrom);
  if(e.attacks)expect(c.attacks.map((a:any)=>({name:a.name,damage:a.damage,cost:a.cost}))).toEqual(e.attacks);if(e.powers)expect(c.powers.map((p:any)=>p.name)).toEqual(e.powers);if(e.text)expect(c.text).toBe(e.text);
 });
});
