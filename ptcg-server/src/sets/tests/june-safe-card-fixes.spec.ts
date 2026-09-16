import { TrainerCard } from '../../game/store/card/trainer-card';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Player } from '../../game/store/state/player';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { CardManager } from '../../game/cards/card-manager';
import { UseStadiumEffect, AttackEffect, MoveCardsEffect } from '../../game/store/effects/game-effects';
import { AttachPokemonToolEffect, PlayItemEffect, PlayStadiumEffect, PlaySupporterEffect } from '../../game/store/effects/play-card-effects';
import { Ralts } from '../set-scarlet-and-violet/ralts';
import { Kirlia } from '../set-scarlet-and-violet/kirlia';
import { GreatTree } from '../set-stellar-crown/grand-tree';
import { Rotom as AscendedRotom } from '../set-ascended-heroes/rotom';
import { HeatRotom } from '../set-destined-rivals/heat-rotom';
import { MowRotom } from '../set-destined-rivals/mow-rotom';
import { Rotom as DestinedRotom } from '../set-destined-rivals/rotom';
import { WashRotom } from '../set-destined-rivals/wash-rotom';
import { Whismur } from '../set-celestial-storm/whismur';

describe('June safe existing-card fixes', () => {
  it('blocks Item, Supporter, Stadium, and Tool play while Whismur CES lock is active', () => {
    const state = new State();
    const whismurPlayer = new Player();
    const lockedPlayer = new Player();
    state.players = [whismurPlayer, lockedPlayer];

    const whismur = new Whismur();
    whismurPlayer.marker.addMarker(whismur.SUDDEN_SHRIEK_MARKER, whismur);
    const trainer = {} as TrainerCard;
    const lockedEffects = [
      new PlayItemEffect(lockedPlayer, trainer),
      new PlaySupporterEffect(lockedPlayer, trainer),
      new PlayStadiumEffect(lockedPlayer, trainer),
      new AttachPokemonToolEffect(lockedPlayer, trainer, lockedPlayer.active)
    ];

    lockedEffects.forEach(effect => {
      expect(() => whismur.reduceEffect({} as StoreLike, state, effect)).toThrow();
    });
  });

  it('blocks a Basic played this turn from Grand Tree selection', () => {
    const state = new State();
    state.turn = 4;
    const player = new Player();
    const opponent = new Player();
    state.players = [player, opponent];
    player.bench = [new PokemonCardList()];
    const grandTree = new GreatTree();
    player.stadium.cards.push(grandTree);

    const playedThisTurn = new Ralts();
    player.active.cards.push(playedThisTurn);
    player.active.pokemonPlayedTurn = state.turn;
    player.bench[0].cards.push(new Ralts());
    player.deck.cards.push(new Kirlia());
    CardManager.getInstance().defineSet([playedThisTurn, new Kirlia()]);

    let choosePokemonPrompt: any;
    const store = {
      reduceEffect: (_state: State, effect: any) => effect,
      prompt: (_state: State, prompt: any) => {
        choosePokemonPrompt = prompt;
        return state;
      }
    } as unknown as StoreLike;

    grandTree.reduceEffect(store, state, new UseStadiumEffect(player, grandTree));

    expect(choosePokemonPrompt.options.blocked).toContain({ player: PlayerType.BOTTOM_PLAYER, slot: 1, index: 0 });
  });

  it('burns the opponent Active once even when Heat Rotom player has a Bench', () => {
    const state = new State();
    const player = new Player();
    const opponent = new Player();
    state.players = [player, opponent];
    player.bench = [new PokemonCardList()];
    player.active.cards.push(new Ralts());
    player.bench[0].cards.push(new Ralts());
    opponent.active.cards.push(new Ralts());
    const applied: AddSpecialConditionsEffect[] = [];
    const store = {
      reduceEffect: (_state: State, effect: unknown) => {
        if (effect instanceof AddSpecialConditionsEffect) applied.push(effect);
        return state;
      }
    } as unknown as StoreLike;
    const heatRotom = new HeatRotom();

    heatRotom.reduceEffect(store, state, new AttackEffect(player, opponent, heatRotom.attacks[0]));

    expect(applied.length).toBe(1);
    expect(applied[0].target).toBe(opponent.active);
    expect(applied[0].specialConditions).toEqual([SpecialCondition.BURNED]);
  });

  it('uses attached Tool lists for every Gadget Show multiplier', () => {
    const state = new State();
    const player = new Player();
    const opponent = new Player();
    state.players = [player, opponent];
    player.bench = [new PokemonCardList()];
    player.active.cards.push(new Ralts());
    player.bench[0].cards.push(new Ralts());
    player.active.tools.push({} as TrainerCard);
    player.bench[0].tools.push({} as TrainerCard);

    const gadgetShowCards = [
      { card: new AscendedRotom(), attackIndex: 1 },
      { card: new HeatRotom(), attackIndex: 1 },
      { card: new MowRotom(), attackIndex: 1 },
      { card: new DestinedRotom(), attackIndex: 1 },
      { card: new WashRotom(), attackIndex: 1 }
    ];

    gadgetShowCards.forEach(({ card, attackIndex }) => {
      const attack = card.attacks[attackIndex];
      const effect = new AttackEffect(player, opponent, attack);
      card.reduceEffect({} as StoreLike, state, effect);
      expect(attack.damageCalculation).toBe('x');
      expect(effect.damage).toBe(60);
    });
  });

  it('discards Mow Rotom Stadium targets through MoveCardsEffect', () => {
    const state = new State();
    const player = new Player();
    const opponent = new Player();
    state.players = [player, opponent];
    const stadium = new GreatTree();
    player.stadium.cards.push(stadium);
    const movementEffects: MoveCardsEffect[] = [];
    const store = {
      reduceEffect: (_state: State, effect: any) => {
        if (effect instanceof MoveCardsEffect) {
          movementEffects.push(effect);
        }
        return state;
      }
    } as unknown as StoreLike;
    const mowRotom = new MowRotom();

    mowRotom.reduceEffect(store, state, new AttackEffect(player, opponent, mowRotom.attacks[0]));

    expect(movementEffects.length).toBe(1);
    expect(movementEffects[0].cards).toEqual([stadium]);
  });
});
