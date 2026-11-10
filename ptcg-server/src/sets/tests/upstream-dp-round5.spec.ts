import { COPY_OPPONENTS_LAST_ATTACK } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType } from '../../game/store/card/card-types';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('Diamond & Pearl base print additions', () => {
  for (const [name, number, weakness] of [['Shinx DP','98',CardType.FIGHTING], ['Starly DP','101',CardType.LIGHTNING], ['Turtwig DP','103',CardType.FIRE]] as const) {
    it(`registers ${name} with its original +10 weakness`, () => {
      const card = getCardByName(name) as PokemonCard;
      expect(card.setNumber).toBe(number);
      expect(card.weakness).toEqual([{ type: weakness, value: +10 }]);
    });
  }
  it('Turtwig can use its free Tackle with no Energy', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Turtwig DP'},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    useAttack(g.store,g.state,0,'Tackle');
    expect(g.player2.active.damage).toBe(10);
  });
  for (const heads of [false,true]) {
    it(`Starly Quick Attack deals the printed damage with heads=${heads}`, () => {
      const g=setupGame({turn:2,player1:{active:{card:'Starly DP',energy:['Grass Energy SVE','Water Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
      const reduce=g.store.reduceEffect.bind(g.store);
      spyOn(g.store,'reduceEffect').and.callFake((state:State,effect:Effect) => {if (effect instanceof CoinFlipEffect) {effect.callback!(heads); return state;} return reduce(state,effect);});
      useAttack(g.store,g.state,0,'Quick Attack');
      expect(g.player2.active.damage).toBe(heads ? 30 : 10);
    });
  }
  it('Shinx Spark deals 10 to the Active and a chosen Benched Pokémon', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Shinx DP',energy:['Lightning Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Mew ex MEW'},{card:'Piplup DP'}],deck:padDeck(10)}});
    g.overridePrompt(ChoosePokemonPromptType,()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:1}]);
    useAttack(g.store,g.state,0,'Spark');
    expect(g.player2.active.damage).toBe(10); expect(g.player2.bench[0].damage).toBe(0); expect(g.player2.bench[1].damage).toBe(10);
  });
  it('Shinx Spark still deals Active damage if there is no Bench', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Shinx DP',energy:['Lightning Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},deck:padDeck(10)}});
    useAttack(g.store,g.state,0,'Spark'); expect(g.player2.active.damage).toBe(10);
  });
  it('Shinx Spark respects Manaphy Wave Veil on the Bench', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Shinx DP',energy:['Lightning Energy SVE']},deck:padDeck(10)},player2:{active:{card:'Mew ex MEW'},bench:[{card:'Manaphy BRS'},{card:'Piplup DP'}],deck:padDeck(10)}});
    g.overridePrompt(ChoosePokemonPromptType,()=>[{player:PlayerType.TOP_PLAYER,slot:SlotType.BENCH,index:1}]);
    useAttack(g.store,g.state,0,'Spark');
    expect(g.player2.active.damage).toBe(10); expect(g.player2.bench[1].damage).toBe(0);
  });

  it('Spark still targets the opponent’s Bench when its attack is copied', () => {
    const g=setupGame({turn:2,player1:{active:{card:'Mew ex MEW'},deck:padDeck(10)},player2:{active:{card:'Shinx DP'},bench:[{card:'Piplup DP'}],deck:padDeck(10)}});
    const shinx=g.player2.active.getPokemonCard()!;
    g.state.playerLastAttack[g.player2.id]={sourceCard:shinx,attack:shinx.attacks[0]};
    COPY_OPPONENTS_LAST_ATTACK(g.store,g.state,new AttackEffect(g.player1,g.player2,{name:'Mimic',cost:[],damage:0,text:''}));
    const choice=g.state.prompts.find(p=>p instanceof ChoosePokemonPrompt && p.result===undefined) as ChoosePokemonPrompt;
    expect(choice).toBeDefined();
    (g.store as any).reducePrompt(g.state,new ResolvePromptAction(choice.id,[g.player2.bench[0]]));
    expect(g.player2.bench[0].damage).toBe(10);
  });

});
