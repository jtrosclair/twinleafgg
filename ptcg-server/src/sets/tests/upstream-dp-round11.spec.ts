import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { COPY_OPPONENTS_LAST_ATTACK } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { resolveAfterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

function game(card:string,energy:string[]=[],opponent='Mew ex MEW',bench:string[]=[]) {
 return setupGame({turn:2,player1:{active:{card,energy},deck:padDeck(15)},player2:{active:{card:opponent},bench:bench.map(card=>({card})),deck:padDeck(15)}});
}
function coin(g:ReturnType<typeof game>,heads:boolean) {
 const reduce=g.store.reduceEffect.bind(g.store);
 spyOn(g.store,'reduceEffect').and.callFake((s:State,e:Effect)=>{if(e instanceof CoinFlipEffect){e.callback!(heads);return s;}return reduce(s,e);});
}
function post(g:ReturnType<typeof game>,attack:AttackEffect) { resolveAfterAttackDamage(()=>undefined,g.store,g.state,attack).next(); }
function copied(g:ReturnType<typeof game>,index:number){const source=g.player2.active.getPokemonCard()!;g.state.playerLastAttack[g.player2.id]={sourceCard:source,attack:source.attacks[index]};return COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));}

describe('Diamond & Pearl batch: printed identity and weaknesses',()=>{
 for(const [name,number,type,value,evolves] of [
  ['Wurmple DP','104',CardType.FIRE,10,undefined],['Stunky DP','102',CardType.FIGHTING,10,undefined],
  ['Chatot DP','74',CardType.LIGHTNING,10,undefined],['Clefairy DP','77',CardType.FIGHTING,10,undefined],
  ['Heracross DP','28',CardType.FIRE,20,undefined],
  ['Bibarel DP','20',CardType.FIGHTING,20,'Bidoof'],['Drapion DP','23',CardType.PSYCHIC,20,'Skorupi'],
  ['Rhyhorn DP','95',CardType.WATER,10,undefined]
 ] as const) it(`registers ${name} with its printed additive weakness`,()=>{
  const c=getCardByName(name) as PokemonCard;expect(c.setNumber).toBe(number);expect(c.weakness).toEqual([{type,value}]);
  if(evolves)expect(c.evolvesFrom).toBe(evolves);
 });
});

describe('Diamond & Pearl batch gameplay',()=>{
 for(const heads of [false,true]) {
  it(`Wurmple Needling Sting deals the printed damage with heads=${heads}`,()=>{const g=game('Wurmple DP',['Grass Energy SVE']);coin(g,heads);useAttack(g.store,g.state,0,'Needling Sting');expect(g.player2.active.damage).toBe(heads?20:10);});
  it(`Wurmple String Shot adds Paralysis only with heads=${heads}`,()=>{const g=game('Wurmple DP',['Grass Energy SVE']);coin(g,heads);const c=g.player1.active.getPokemonCard()!,effect=new AttackEffect(g.player1,g.player2,c.attacks[1]);g.store.reduceEffect(g.state,effect);post(g,effect);expect(g.player2.active.specialConditions.includes(SpecialCondition.PARALYZED)).toBe(heads);});
  it(`Drapion Stomp adds the coin bonus only with heads=${heads}`,()=>{const g=game('Drapion DP',['Water Energy SVE','Water Energy SVE']);coin(g,heads);useAttack(g.store,g.state,0,'Stomp');expect(g.player2.active.damage).toBe(heads?40:20);});
  it(`Chatot Tone-Deaf adds Confusion only with heads=${heads}`,()=>{const g=game('Chatot DP',['Water Energy SVE']);coin(g,heads);const c=g.player1.active.getPokemonCard()!;const attack=new AttackEffect(g.player1,g.player2,c.attacks[1]);g.store.reduceEffect(g.state,attack);post(g,attack);expect(g.player2.active.specialConditions.includes(SpecialCondition.CONFUSED)).toBe(heads);});
  it(`Heracross Horn Slash adds the coin bonus only with heads=${heads}`,()=>{const g=game('Heracross DP',['Grass Energy SVE','Grass Energy SVE']);coin(g,heads);useAttack(g.store,g.state,0,'Horn Slash');expect(g.player2.active.damage).toBe(heads?60:30);});
 }
 for(const [card,attack] of [['Stunky DP','Severe Gas'],['Drapion DP','Poison Claws']] as const) it(`${card} poisons the defending Pokémon`,()=>{const g=game(card);const c=g.player1.active.getPokemonCard()!,effect=new AttackEffect(g.player1,g.player2,c.attacks.find(a=>a.name===attack)!);g.store.reduceEffect(g.state,effect);post(g,effect);expect(g.player2.active.specialConditions).toContain(SpecialCondition.POISONED);});
 for(const [card,index] of [['Stunky DP',1],['Clefairy DP',0],['Heracross DP',0]] as const) it(`${card} does not affect a replacement in the same defending slot`,()=>{const g=game(card,[],'Mew ex MEW',['Squirtle BS']);const source=g.player1.active.getPokemonCard()!,attack=new AttackEffect(g.player1,g.player2,source.attacks[index]);g.store.reduceEffect(g.state,attack);const replacement=getCardByName('Squirtle BS') as PokemonCard;g.player2.active.cards=[replacement];post(g,attack);expect(g.player2.active.getPokemonCard()).toBe(replacement);expect(g.player2.active.specialConditions.length).toBe(0);expect(g.state.prompts.filter(p=>p.result===undefined).length).toBe(0);});
 it('Bibarel Rest does not heal a replacement in the same attacking slot',()=>{const g=game('Bibarel DP');g.player1.active.damage=70;const source=g.player1.active.getPokemonCard()!,attack=new AttackEffect(g.player1,g.player2,source.attacks[0]);g.store.reduceEffect(g.state,attack);const replacement=getCardByName('Mew ex MEW') as PokemonCard;g.player1.active.cards=[replacement];post(g,attack);expect(g.player1.active.damage).toBe(70);expect(g.player1.active.specialConditions.length).toBe(0);});
 it('copied Severe Gas poisons the actual defender after damage',()=>{const g=game('Mew ex MEW',[],'Stunky DP');copied(g,1);expect(g.player2.active.specialConditions).toContain(SpecialCondition.POISONED);expect(g.player1.active.specialConditions).not.toContain(SpecialCondition.POISONED);});
 it('copied Take Down deals recoil to the copycat, not the printed source',()=>{const g=game('Mew ex MEW',[],'Rhyhorn DP');copied(g,1);expect(g.player1.active.damage).toBe(10);expect(g.player2.active.damage).toBe(30);});
 it('Heracross copied Pitch lets the opponent choose its replacement after damage',()=>{const g=game('Mew ex MEW',[],'Heracross DP',['Squirtle BS']);copied(g,0);const prompt=g.state.prompts.find(p=>p instanceof ChoosePokemonPrompt && p.result===undefined) as ChoosePokemonPrompt;expect(prompt).toBeDefined();expect(prompt.playerId).toBe(g.player2.id);expect(g.player2.active.damage).toBe(10);(g.store as any).reducePrompt(g.state,new ResolvePromptAction(prompt.id,[g.player2.bench[0]]));expect(g.player2.active.getPokemonCard()!.name).toBe('Squirtle');});
 for(const card of ['Rhyhorn DP','Bibarel DP']) it(`${card} Take Down follows the original attacker through a damage-time switch`,()=>{const g=setupGame({turn:2,player1:{active:{card},bench:[{card:'Squirtle BS'}],deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});const original=g.player1.active,c=original.getPokemonCard()!,attack=new AttackEffect(g.player1,g.player2,c.attacks[1]);g.store.reduceEffect(g.state,attack);expect(original.damage).toBe(0);g.player1.switchPokemon(g.player1.bench[0]);post(g,attack);expect(original.damage).toBe(10);expect(g.player1.active.damage).toBe(0);});
 for(const card of ['Wurmple DP','Chatot DP']) it(`${card} still emits its post-damage coin event when the defender was replaced`,()=>{const g=game(card);const reduce=g.store.reduceEffect.bind(g.store);let flips=0;spyOn(g.store,'reduceEffect').and.callFake((state:State,e:Effect)=>{if(e instanceof CoinFlipEffect){flips++;e.callback!(true);return state;}return reduce(state,e);});const source=g.player1.active.getPokemonCard()!,attack=new AttackEffect(g.player1,g.player2,source.attacks[1]);g.store.reduceEffect(g.state,attack);expect(flips).toBe(0);const replacement=getCardByName('Squirtle BS') as PokemonCard;g.player2.active.cards=[replacement];post(g,attack);expect(flips).toBe(1);expect(g.player2.active.getPokemonCard()).toBe(replacement);expect(g.player2.active.specialConditions.length).toBe(0);});
 it('Chatot draws for the attacking player even if its source is replaced during damage',()=>{const g=game('Chatot DP'),first=g.player1.deck.cards[0],source=g.player1.active.getPokemonCard()!,attack=new AttackEffect(g.player1,g.player2,source.attacks[0]);g.store.reduceEffect(g.state,attack);expect(g.player1.hand.cards).not.toContain(first);g.player1.active.cards=[getCardByName('Squirtle BS')];post(g,attack);expect(g.player1.hand.cards).toContain(first);});
 for(const card of ['Rhyhorn DP','Bibarel DP']) it(`${card} recoil does not hit a replacement in the same attacker slot`,()=>{const g=game(card),source=g.player1.active.getPokemonCard()!,attack=new AttackEffect(g.player1,g.player2,source.attacks[1]);g.store.reduceEffect(g.state,attack);g.player1.active.cards=[getCardByName('Squirtle BS')];post(g,attack);expect(g.player1.active.damage).toBe(0);});
 it('attack-effect protection prevents Severe Gas Poison',()=>{const g=game('Stunky DP');g.player2.active.preventEffectsOfAttacksNextTurn=true;const c=g.player1.active.getPokemonCard()!;const attack=new AttackEffect(g.player1,g.player2,c.attacks[1]);g.store.reduceEffect(g.state,attack);post(g,attack);expect(g.player2.active.specialConditions).not.toContain(SpecialCondition.POISONED);});
 it('Chatot Me First draws exactly one card from the top of its deck',()=>{const g=game('Chatot DP');const first=g.player1.deck.cards[0],size=g.player1.deck.cards.length;const c=g.player1.active.getPokemonCard()!;const attack=new AttackEffect(g.player1,g.player2,c.attacks[0]);g.store.reduceEffect(g.state,attack);post(g,attack);expect(g.player1.hand.cards).toContain(first);expect(g.player1.deck.cards.length).toBe(size-1);});
 it('Clefairy Sing makes the defender Asleep',()=>{const g=game('Clefairy DP');const c=g.player1.active.getPokemonCard()!;const attack=new AttackEffect(g.player1,g.player2,c.attacks[0]);g.store.reduceEffect(g.state,attack);post(g,attack);expect(g.player2.active.specialConditions).toContain(SpecialCondition.ASLEEP);});
 for(const evolved of [false,true]) it(`Clefairy Moon Impact handles Cleffa underneath=${evolved}`,()=>{const g=game('Clefairy DP',['Water Energy SVE','Water Energy SVE']);if(evolved)g.player1.active.cards.unshift(getCardByName('Cleffa DP'));useAttack(g.store,g.state,0,'Moon Impact');expect(g.player2.active.damage).toBe(evolved?40:20);});
 it('copied Moon Impact checks the actual attacker’s evolution stack',()=>{const g=game('Mew ex MEW',[],'Clefairy DP');g.player1.active.cards.unshift(getCardByName('Cleffa DP'));copied(g,1);expect(g.player2.active.damage).toBe(40);});
 it('Bibarel Rest removes Special Conditions, heals up to 40, then causes Sleep',()=>{const g=game('Bibarel DP');g.player1.active.damage=70;g.player1.active.specialConditions=[SpecialCondition.CONFUSED,SpecialCondition.POISONED];const c=g.player1.active.getPokemonCard()!;const attack=new AttackEffect(g.player1,g.player2,c.attacks[0]);g.store.reduceEffect(g.state,attack);post(g,attack);expect(g.player1.active.damage).toBe(30);expect(g.player1.active.specialConditions).toEqual([SpecialCondition.ASLEEP]);});
 for(const [card,attack,cost,damage] of [['Rhyhorn DP','Take Down',['Fighting Energy SVE','Water Energy SVE'],30],['Bibarel DP','Take Down',['Water Energy SVE','Water Energy SVE','Water Energy SVE'],60]] as const) it(`${card} deals recoil after damaging the defender`,()=>{const g=game(card,[...cost],'Charizard ex OBF');useAttack(g.store,g.state,0,attack);expect(g.player2.active.damage).toBe(damage);expect(g.player1.active.damage).toBe(10);});
 for(const [card,attack] of [['Heracross DP','Pitch']] as const) {
  it(`${card} lets the opponent switch the defender after damage`,()=>{const g=game(card,['Water Energy SVE','Water Energy SVE'],'Mew ex MEW',['Squirtle BS']);useAttack(g.store,g.state,0,attack);expect(g.player2.active.getPokemonCard()!.name).toBe('Squirtle');expect(g.player2.bench[0].getPokemonCard()!.name).toBe('Mew ex');expect(g.player2.bench[0].damage).toBe(10);});
  it(`${card} does not switch a protected defender`,()=>{const g=game(card,['Water Energy SVE','Water Energy SVE'],'Mew ex MEW',['Squirtle BS']);g.player2.active.preventEffectsOfAttacksNextTurn=true;useAttack(g.store,g.state,0,attack);expect(g.player2.active.getPokemonCard()!.name).toBe('Mew ex');});
 }
});
