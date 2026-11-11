import { ensureClientCards } from '../../client/cards';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { getCardByName } from './test-helpers';
const rows=[{"name":"Beldum UL","stage":"BASIC","weakness":[{"type":"PSYCHIC"}],"resistance":[],"retreat":["COLORLESS","COLORLESS"],"attacks":[{"name":"Reaction","cost":["PSYCHIC"],"text":"You may switch Beldum with 1 of your Benched Pokémon."}]}] as Array<any>;
describe('round29 extra printed metadata',()=>{beforeAll(()=>ensureClientCards());for(const row of rows)it(row.name,()=>{const c=getCardByName(row.name) as PokemonCard;expect(c.stage).toBe((Stage as any)[row.stage]);expect(c.weakness).toEqual(row.weakness.map((x:any)=>({...x,type:(CardType as any)[x.type]})));expect(c.resistance).toEqual(row.resistance.map((x:any)=>({...x,type:(CardType as any)[x.type]})));expect(c.retreat).toEqual(row.retreat.map((x:string)=>(CardType as any)[x]));expect(c.attacks.map(a=>({name:a.name,cost:a.cost,text:a.text}))).toEqual(row.attacks.map((a:any)=>({...a,cost:a.cost.map((x:string)=>(CardType as any)[x])})));})});
