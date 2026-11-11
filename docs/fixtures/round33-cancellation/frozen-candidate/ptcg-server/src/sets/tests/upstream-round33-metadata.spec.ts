import { getCardByName } from './test-helpers';

type Expected = { fullName:string;set:string;number:string;name:string;hp?:number;stage?:number;type?:number;retreat?:number;regulationMark?:string;evolvesFrom?:string;attacks?:Array<{name:string;damage:number;cost:number[]}>;powers?:string[];text?:string };
const expected:Expected[] = [
  {
    "fullName": "Iono's Kilowattrel SVP",
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
    "fullName": "Lillie's Ribombee SVP",
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
    "fullName": "Hop's Snorlax SVP",
    "set": "SVP",
    "number": "184",
    "name": "Hop's Snorlax",
    "hp": 150,
    "stage": 2,
    "type": 9,
    "retreat": 4,
    "regulationMark": "I",
    "attacks": [
      {
        "name": "Dynamic Press",
        "damage": 140,
        "cost": [
          9,
          9,
          9
        ]
      }
    ],
    "powers": [
      "Extra Helpings"
    ]
  },
  {
    "fullName": "Hop's Zacian ex SVP",
    "set": "SVP",
    "number": "193",
    "name": "Hop's Zacian ex",
    "hp": 230,
    "stage": 2,
    "type": 8,
    "retreat": 2,
    "regulationMark": "I",
    "attacks": [
      {
        "name": "Insta-Strike",
        "damage": 30,
        "cost": [
          9
        ]
      },
      {
        "name": "Brave Slash",
        "damage": 240,
        "cost": [
          8,
          8,
          8,
          9
        ]
      }
    ]
  },
  {
    "fullName": "Iono's Bellibolt ex SVP",
    "set": "SVP",
    "number": "194",
    "name": "Iono's Bellibolt ex",
    "hp": 280,
    "stage": 3,
    "type": 4,
    "retreat": 2,
    "regulationMark": "I",
    "evolvesFrom": "Iono's Tadbulb",
    "attacks": [
      {
        "name": "Thunderous Bolt",
        "damage": 230,
        "cost": [
          4,
          4,
          4,
          9
        ]
      }
    ],
    "powers": [
      "Electric Streamer"
    ]
  },
  {
    "fullName": "Lillie's Clefairy ex SVP",
    "set": "SVP",
    "number": "195",
    "name": "Lillie's Clefairy ex",
    "hp": 190,
    "stage": 2,
    "type": 5,
    "retreat": 1,
    "regulationMark": "I",
    "attacks": [
      {
        "name": "Full Moon Rondo",
        "damage": 20,
        "cost": [
          5,
          9
        ]
      }
    ],
    "powers": [
      "Fairy Zone"
    ]
  },
  {
    "fullName": "Cynthia's Garchomp ex SVP",
    "set": "SVP",
    "number": "204",
    "name": "Cynthia's Garchomp ex",
    "hp": 330,
    "stage": 4,
    "type": 6,
    "retreat": 0,
    "regulationMark": "I",
    "evolvesFrom": "Cynthia's Gabite",
    "attacks": [
      {
        "name": "Corkscrew Dive",
        "damage": 100,
        "cost": [
          6
        ]
      },
      {
        "name": "Draconic Buster",
        "damage": 260,
        "cost": [
          6,
          6
        ]
      }
    ]
  },
  {
    "fullName": "Professor's Research SVP",
    "set": "SVP",
    "number": "221",
    "name": "Professor's Research",
    "regulationMark": "G",
    "text": "Discard your hand and draw 7 cards."
  },
  {
    "fullName": "Luxio P8",
    "set": "P8",
    "number": "8",
    "name": "Luxio",
    "hp": 80,
    "stage": 3,
    "type": 4,
    "retreat": 0,
    "evolvesFrom": "Shinx",
    "attacks": [
      {
        "name": "Fasten Claws",
        "damage": 10,
        "cost": [
          9
        ]
      },
      {
        "name": "Thunder Fang",
        "damage": 30,
        "cost": [
          4,
          4
        ]
      }
    ]
  },
  {
    "fullName": "Piplup P8",
    "set": "P8",
    "number": "15",
    "name": "Piplup",
    "hp": 60,
    "stage": 2,
    "type": 3,
    "retreat": 1,
    "attacks": [
      {
        "name": "Peck",
        "damage": 10,
        "cost": []
      },
      {
        "name": "Water Splash",
        "damage": 20,
        "cost": [
          3,
          9
        ]
      }
    ]
  }
];
describe('round33 exact printed metadata',()=>{
 for(const e of expected)it(e.fullName,()=>{
  const c:any=getCardByName(e.fullName);expect(c.set).toBe(e.set);expect(c.setNumber).toBe(e.number);expect(c.name).toBe(e.name);
  if(e.hp!==undefined)expect(c.hp).toBe(e.hp);if(e.stage!==undefined)expect(c.stage).toBe(e.stage);if(e.type!==undefined)expect(c.cardType).toBe(e.type);
  if(e.retreat!==undefined)expect(c.retreat.length).toBe(e.retreat);if(e.regulationMark!==undefined)expect(c.regulationMark).toBe(e.regulationMark);if(e.evolvesFrom!==undefined)expect(c.evolvesFrom).toBe(e.evolvesFrom);
  if(e.attacks)expect(c.attacks.map((a:any)=>({name:a.name,damage:a.damage,cost:a.cost}))).toEqual(e.attacks);if(e.powers)expect(c.powers.map((p:any)=>p.name)).toEqual(e.powers);if(e.text)expect(c.text).toBe(e.text);
 });
});
