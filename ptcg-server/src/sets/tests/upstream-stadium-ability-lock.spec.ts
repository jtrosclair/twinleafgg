import { CardTag } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Power, PowerType } from '../../game/store/card/pokemon-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { GamePhase, State } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { PathToThePeak } from '../set-chilling-reign/path-to-the-peak';
import { PowerPlant } from '../set-unbroken-bonds/power-plant';
import { Lunatone } from '../set-obsidian-flames/lunatone';
import { Garbodor } from '../set-dragons-exalted/garbodor';
import { Shiftry } from '../set-steam-siege/shiftry';
import { TeamRocketsMewtwoex } from '../set-destined-rivals/team-rockets-mewtwo-ex';
import { PsychicEnergy } from '../set-scarlet-and-violet-energy/psychic-energy';

class RuleBoxPokemon extends PokemonCard {
  public name = 'Rule Box'; public fullName = 'Rule Box TST'; public set = 'TST';
  public hp = 200; public tags = [CardTag.POKEMON_EX];
  public powers: Power[] = [
    { name: 'Ability', powerType: PowerType.ABILITY, text: '' },
    { name: 'Poké-Power', powerType: PowerType.POKEPOWER, text: '' },
    { name: 'From Hand', powerType: PowerType.ABILITY, text: '', useFromHand: true },
    { name: 'From Discard', powerType: PowerType.ABILITY, text: '', useFromDiscard: true },
  ];
}
class Solrock extends PokemonCard { public name = 'Solrock'; public fullName = 'Solrock TST'; public set = 'TST'; }
class Tool extends TrainerCard { public name = 'Tool'; public fullName = 'Tool TST'; public set = 'TST'; }
function setup(stadium: TrainerCard) {
  const state = new State(), player = new Player(), opponent = new Player();
  player.id = 1; opponent.id = 2; state.players = [player, opponent]; state.phase = GamePhase.PLAYER_TURN; state.turn = 3;
  const ours = new RuleBoxPokemon(), theirs = new RuleBoxPokemon();
  player.active.cards = [ours]; opponent.active.cards = [theirs]; player.stadium.cards = [stadium];
  const store = new Store({ onStateChange: () => undefined }); store.state = state;
  const check = (owner: Player, card: PokemonCard) => {
    const e = new CheckPokemonPowersEffect(owner, card); store.reduceEffect(state, e); return e.powers.map(p => p.name);
  };
  const use = (owner: Player, card: PokemonCard, index = 0) => () => store.reduceEffect(state, new PowerEffect(owner, card.powers[index], card));
  const bench = (owner: Player, card: PokemonCard) => { const slot = new PokemonCardList(); slot.cards = [card]; owner.bench.push(slot); return slot; };
  return { state, player, opponent, ours, theirs, store, check, use, bench };
}

describe('upstream Stadium Ability lock compatibility', () => {
  for (const make of [() => new PathToThePeak(), () => new PowerPlant()]) {
    const name = make().name;
    it(`${name} blocks entering Ability probes but permits powers used from hand or discard`, () => {
      const b = setup(make()), entering = new RuleBoxPokemon(); b.player.hand.cards = [entering];
      expect(b.use(b.player, entering)).toThrow();
      expect(b.use(b.player, entering, 2)).not.toThrow();
      expect(b.use(b.player, entering, 3)).not.toThrow();
    });
    it(`${name} removes only applicable Abilities from in-play power discovery`, () => {
      const b = setup(make());
      expect(b.check(b.player, b.ours)).toEqual(['Poké-Power', 'From Hand', 'From Discard']);
      expect(b.use(b.player, b.ours, 1)).not.toThrow();
      expect(b.use(b.player, b.ours)).toThrow();
    });
    it(`${name} respects New Moon only for its owner`, () => {
      const b = setup(make()); b.bench(b.player, new Lunatone()); b.bench(b.player, new Solrock());
      expect(b.use(b.player, b.ours)).not.toThrow();
      expect(b.check(b.player, b.ours)).toContain('Ability');
      expect(b.use(b.opponent, b.theirs)).toThrow();
      expect(b.check(b.opponent, b.theirs)).not.toContain('Ability');
    });
    it(`${name} applies normally when Wicked Wind suppresses Stadiums`, () => {
      const b = setup(make()), shiftry = new Shiftry(); b.bench(b.opponent, shiftry);
      b.opponent.marker.addMarker(shiftry.WICKED_WIND_MARKER, shiftry);
      expect(b.use(b.player, b.ours)).not.toThrow();
      expect(b.check(b.player, b.ours)).toContain('Ability');
    });
    it(`${name} applies if Garbotoxin blocks New Moon`, () => {
      const b = setup(make()); b.bench(b.player, new Lunatone()); b.bench(b.player, new Solrock());
      const garbodor = new Garbodor(), slot = b.bench(b.opponent, garbodor), tool = new Tool();
      slot.cards.push(tool); slot.tools.push(tool);
      expect(b.use(b.player, b.ours)).toThrow();
      expect(b.check(b.player, b.ours)).not.toContain('Ability');
    });
  }
  it('Path recognizes Mega ex while Power Plant does not', () => {
    const a = setup(new PathToThePeak()), b = setup(new PowerPlant());
    a.ours.tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex]; a.ours.regulationMark = 'I';
    b.ours.tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex]; b.ours.regulationMark = 'I';
    expect(a.use(a.player, a.ours)).toThrow();
    expect(b.use(b.player, b.ours)).not.toThrow();
  });
  it('Path does not treat pre-regulation Pokémon ex or Lv.X as Rule Box Pokémon', () => {
    const b = setup(new PathToThePeak());
    b.ours.tags = [CardTag.POKEMON_ex]; b.ours.regulationMark = '';
    expect(b.use(b.player, b.ours)).not.toThrow();
    expect(b.check(b.player, b.ours)).toContain('Ability');
    b.ours.tags = [CardTag.POKEMON_LV_X];
    expect(b.use(b.player, b.ours)).not.toThrow();
  });
  it('both Stadiums lock GX, but Power Plant does not lock modern lowercase ex', () => {
    const a = setup(new PathToThePeak()), b = setup(new PowerPlant());
    a.ours.tags = [CardTag.POKEMON_GX]; b.ours.tags = [CardTag.POKEMON_GX];
    expect(a.use(a.player, a.ours)).toThrow(); expect(b.use(b.player, b.ours)).toThrow();
    a.ours.tags = [CardTag.POKEMON_ex]; a.ours.regulationMark = 'I';
    b.ours.tags = [CardTag.POKEMON_ex]; b.ours.regulationMark = 'I';
    expect(a.use(a.player, a.ours)).toThrow(); expect(b.use(b.player, b.ours)).not.toThrow();
  });
  it('suppresses a real Power Saver Ability, unless New Moon protects it', () => {
    const b = setup(new PathToThePeak()), mewtwo = new TeamRocketsMewtwoex();
    b.player.active.cards = [mewtwo, new PsychicEnergy(), new PsychicEnergy(), new PsychicEnergy()];
    const attack = () => b.store.reduceEffect(b.state, new UseAttackEffect(b.player, mewtwo.attacks[0]));
    expect(attack).not.toThrow();
    b.bench(b.player, new Lunatone()); b.bench(b.player, new Solrock());
    expect(attack).toThrow();
    b.player.stadium.cards = [];
    expect(attack).toThrow();
  });
});
