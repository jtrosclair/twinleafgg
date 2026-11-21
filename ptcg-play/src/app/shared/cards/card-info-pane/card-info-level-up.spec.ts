import { CardType, PokemonCard, PokemonCardList, PowerType, Stage } from 'ptcg-server';
import { of } from 'rxjs';
import { CardInfoPaneComponent } from './card-info-pane.component';

class TestPokemon extends PokemonCard {
  public name = 'Dusknoir';
  public fullName = 'Test Dusknoir';
  public set = 'TEST';
  public stage = Stage.STAGE_2;
}

describe('Level Up card actions', () => {
  it('offers only the immediately previous level’s printed actions beside the LV.X card’s actions', () => {
    const previous = new TestPokemon();
    previous.attacks = [{ name: 'Night Spin', damage: 50, cost: [CardType.PSYCHIC], text: '' }];
    previous.powers = [{ name: 'Shadow Command', powerType: PowerType.POKEPOWER, useWhenInPlay: true, text: '' }];
    const lower = new TestPokemon();
    lower.name = 'Dusclops';
    lower.powers = [{ name: 'Cursed Blast', powerType: PowerType.ABILITY, useWhenInPlay: true, text: '' }];
    const top = new TestPokemon();
    top.stage = Stage.LV_X;
    top.evolvesFrom = previous.name;
    top.powers = [{ name: 'Ectoplasm', powerType: PowerType.POKEPOWER, text: '' }];
    const slot = new PokemonCardList();
    slot.cards = [lower, previous, top];
    const pane = new CardInfoPaneComponent({} as any, { showTags$: of(false) } as any);
    pane.card = top;
    pane.cardList = slot;
    pane.options = { enableAttack: true, enableAbility: { useWhenInPlay: true } };
    pane.ngOnChanges();
    expect(pane.getDisplayAttacks().map(attack => attack.name)).toEqual(['Night Spin']);
    expect(pane.getDisplayPowers().map(power => power.name)).toEqual(['Ectoplasm', 'Shadow Command']);
    expect(pane.enabledAbilities).toEqual({ 'Shadow Command': true });
    pane.ngOnDestroy();
  });
});
