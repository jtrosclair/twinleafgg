import { ensureClientCards } from '../../client/cards';
import { padDeck,setupGame } from './test-helpers';
import { useAbility,useAttack,playTrainerCard } from './card-test-helpers';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { AttachEnergyPrompt, AttachEnergyPromptType } from '../../game/store/prompts/attach-energy-prompt';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';

const W='Water Energy SVE',L='Lightning Energy SVE',P='Psychic Energy SVE',F='Fire Energy SVE';
function game(name:string,energy:string[],copied:boolean){const g=setupGame({turn:5,player1:{active:{card:copied?'Mew ex 30C':name,energy},bench:[...(copied?[{card:name}]:[]),{card:'Charmander BS'}],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Squirtle BS'}],deck:padDeck(12)}});const t=g.player2.active.getPokemonCard()!;t.hp=1000;t.weakness=[];t.resistance=[];return g}
function attack(g:ReturnType<typeof game>,move:string,copied:boolean){if(copied){g.overridePrompt('Choose attack',()=>({index:0,attack:move}));useAbility(g.store,g.state,0,'Memory Helix')}else useAttack(g.store,g.state,0,move)}
describe('upstream round33 gameplay',()=>{
 beforeAll(()=>ensureClientCards());beforeEach(()=>clearCopyAttackSessionsForTests());
 for(const copied of [false,true])for(const heads of [false,true]){
  it('Piplup P8 Water Splash printed 20+ copied='+copied+' heads='+heads,()=>{const g=game('Piplup P8',[W,W],copied);spyOn(Math,'random').and.returnValue(heads?.1:.9);attack(g,'Water Splash',copied);expect(g.player2.active.damage).toBe(heads?30:20)});
  it('Luxio P8 Fasten Claws copied='+copied+' heads='+heads,()=>{const g=game('Luxio P8',[L],copied);spyOn(Math,'random').and.returnValue(heads?.1:.9);attack(g,'Fasten Claws',copied);expect(g.player2.active.damage).toBe(heads?40:10)});
 }
 for(const copied of [false,true])it('Lillie Clefairy SVP Full Moon Rondo counts both Benches copied='+copied,()=>{const g=game("Lillie's Clefairy ex SVP",[P,F],copied);attack(g,'Full Moon Rondo',copied);expect(g.player2.active.damage).toBe(copied?80:60)});
 for(const n of ['221'])it('Professor Research SVP '+n+' discards hand, draws seven, uses Supporter',()=>{const name=n==='221'?"Professor's Research SVP":`Professor's Research${+n-220} SVP`,g=setupGame({turn:5,player1:{active:{card:'Charmander BS'},hand:[name,F],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}}),trainer=g.player1.hand.cards[0],old=g.player1.hand.cards[1];playTrainerCard(g.store,g.state,0,name);expect(g.player1.hand.cards.length).toBe(7);expect(g.player1.discard.cards).toContain(old);expect(g.player1.discard.cards).toContain(trainer);expect(g.player1.supporterTurn).toBe(1)});
 it('Iono Kilowattrel SVP ability discards one Lightning Energy and draws to six',()=>{
  const name="Iono's Kilowattrel SVP",g=setupGame({turn:5,player1:{active:{card:name,energy:[L]},hand:[F],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}}),energy=g.player1.active.energies.cards[0];useAbility(g.store,g.state,0,'Flashing Draw');expect(g.player1.discard.cards).toContain(energy);expect(g.player1.hand.cards.length).toBe(6);
 });
 it('Iono Bellibolt SVP ability attaches Lightning to an eligible Iono Pokemon',()=>{
  const name="Iono's Bellibolt ex SVP",g=setupGame({turn:5,player1:{active:{card:name},bench:[{card:'Charmander BS'}],hand:[L],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(12)}}),energy=g.player1.hand.cards[0];
  g.overridePrompt(AttachEnergyPromptType,(p:any)=>{const q=p as AttachEnergyPrompt;expect(q.options.blockedTo).toContain({player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0} as any);return [{index:q.cardList.cards.indexOf(energy),to:{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.ACTIVE,index:0}}]});useAbility(g.store,g.state,0,'Electric Streamer');expect(g.player1.active.cards).toContain(energy);expect(g.player1.hand.cards).not.toContain(energy);
 });
 for(const copied of [false,true])it('Hop Zacian SVP Insta-Strike hits active and selected Bench copied='+copied,()=>{
  const g=game("Hop's Zacian ex SVP",[F],copied);g.overridePrompt('Choose pokemon',()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:0}]);attack(g,'Insta-Strike',copied);expect(g.player2.active.damage).toBe(30);expect(g.player2.bench[0].damage).toBe(30);
 });

 for(const copied of [false,true])it('Cynthia Garchomp SVP Corkscrew draws to six copied='+copied,()=>{
  const g=game("Cynthia's Garchomp ex SVP",['Fighting Energy SVE'],copied);attack(g,'Corkscrew Dive',copied);expect(g.player2.active.damage).toBe(100);expect(g.player1.hand.cards.length).toBe(6);
 });
 for(const copied of [false,true])it('Hop Snorlax SVP Dynamic Press damages attacker and preserves Ability ownership copied='+copied,()=>{
  const g=game("Hop's Snorlax SVP",[F,F,F],copied);g.player1.active.getPokemonCard()!.hp=1000;attack(g,'Dynamic Press',copied);expect(g.player2.active.damage).toBe(copied?140:170);expect(g.player1.active.damage).toBe(80);
 });
 it('Lillie Ribombee SVP Inviting Wink places selected opposing Basic onto their Bench',()=>{
  const name="Lillie's Ribombee SVP",g=setupGame({turn:5,player1:{active:{card:'Charmander BS'},bench:[{card:"Lillie's Cutiefly JTG"}],hand:[name],deck:padDeck(12)},player2:{active:{card:'Mew ex MEW'},hand:['Bulbasaur BS',F],deck:padDeck(12)}});const basic=g.player2.hand.cards[0];g.player1.bench[0].pokemonPlayedTurn=1;g.overridePrompt('Choose cards',()=>[0]);g.store.dispatch(new PlayCardAction(g.player1.id,0,{player:PlayerType.BOTTOM_PLAYER,slot:SlotType.BENCH,index:0}));expect(g.player1.bench[0].getPokemonCard()!.fullName).toBe(name);expect(g.player2.bench.some(slot=>slot.cards.includes(basic))).toBe(true);
 });

 for(const copied of [false,true])for(const [name,move,energy,expected] of [["Iono's Kilowattrel SVP",'Mach Bolt',[L,F,F],70],["Lillie's Ribombee SVP",'Magical Shot',[P],50]] as Array<[string,string,string[],number]>)it(name+' actual '+move+' copied='+copied,()=>{const g=game(name,energy,copied);attack(g,move,copied);expect(g.player2.active.damage).toBe(expected)});
 for(const copied of [false,true])it('Iono Bellibolt SVP Thunderous Bolt retains next-turn attack lock copied='+copied,()=>{const g=game("Iono's Bellibolt ex SVP",[L,L,L,F],copied),source=g.player1.active;attack(g,'Thunderous Bolt',copied);expect(g.player2.active.damage).toBe(230);expect(source.cannotAttackNextTurn||source.cannotAttackNextTurnPending).toBe(true)});

});
