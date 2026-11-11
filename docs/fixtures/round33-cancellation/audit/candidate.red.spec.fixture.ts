import { ensureClientCards } from '../../client/cards';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { PlayerType,SlotType } from '../../game/store/actions/play-card-action';
import { padDeck,setupGame } from './test-helpers';
import { useAbility,useAttack } from './card-test-helpers';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
const F='Fire Energy SVE',L='Lightning Energy SVE',P='Psychic Energy SVE';
const entries=[{name:"Hop's Zacian ex SVP",attack:'Insta-Strike',energy:[F]},{name:"Cynthia's Garchomp ex SVP",attack:'Corkscrew Dive',energy:['Fighting Energy SVE']},{name:"Hop's Snorlax SVP",attack:'Dynamic Press',energy:[F,F,F]},{name:"Iono's Bellibolt ex SVP",attack:'Thunderous Bolt',energy:[L,L,L,F]},{name:"Lillie's Clefairy ex SVP",attack:'Full Moon Rondo',energy:[P,F]}];
describe('round33 real Sand Attack cancellation audit',()=>{
 beforeAll(()=>ensureClientCards());beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true])for(const c of entries)it(c.name+' copied='+copied,()=>{
  const g=setupGame({turn:5,player1:{active:{card:copied?'Mew ex 30C':c.name,energy:c.energy},bench:copied?[{card:c.name}]:[],deck:padDeck(12)},player2:{active:{card:'Hippopotas M3'},bench:[{card:'Charmander BS'}],deck:padDeck(12)}});g.player1.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.hp=1000;g.player2.active.getPokemonCard()!.weakness=[];const attacker=g.player1.active,hand=g.player1.hand.cards.length;
  const coins:boolean[]=[], canceled:boolean[]=[], attacks:AttackEffect[]=[];const reduce=g.store.reduceEffect.bind(g.store);spyOn(g.store,'reduceEffect').and.callFake((st:State,e:Effect)=>{if(e instanceof AttackEffect && e.attack.name===c.attack)attacks.push(e);if(e instanceof CoinFlipEffect){const cb=e.callback;e.callback=value=>{coins.push(value);if(cb)cb(value);canceled.push(attacks.some(a=>a.preventDefault))}}return reduce(st,e)});
  attacker.marker.addMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN,g.player2.active.getPokemonCard()!);spyOn(Math,'random').and.returnValue(.99);g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}]);
  if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:c.attack}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,c.attack);
  expect(coins).toContain(false);expect(canceled).toContain(true);expect(g.player2.active.damage).toBe(0);expect(g.player2.bench[0].damage).toBe(0);expect(attacker.damage).toBe(0);expect(g.player1.hand.cards.length).toBe(hand);expect(attacker.cannotAttackNextTurn||attacker.cannotAttackNextTurnPending).toBe(false);
 });
});
