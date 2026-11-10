import { PokemonCard } from '../store/card/pokemon-card';
import { TrainerCard } from '../store/card/trainer-card';
import { StateSerializer } from './state-serializer';
import { Card } from '../store/card/card';

class PyroductLeft extends TrainerCard {
  public name = 'Legendary Pyroduct';
  public fullName = 'Legendary Lava Lake (Left) M6';
  public set = 'DLR';
  public setNumber = '94';
}
class PyroductRight extends PyroductLeft {
  public fullName = 'Legendary Lava Lake (Right) M6';
  public setNumber = '95';
}
class Nidoran extends PokemonCard {
  public name = 'Nidoran ♀';
  public fullName = 'Nidoran F M6';
  public set = 'DLR';
  public setNumber = '55';
}
class Kecleon extends PokemonCard {
  public name = 'Kecleon';
  public fullName = 'Kecleon M6';
  public set = 'DLR';
  public setNumber = '83';
}
class KecleonAlt extends Kecleon {
  public fullName = 'Kecleon2 DLR';
  public setNumber = '117';
}

class Rayquaza extends PokemonCard {
  public name = 'Mega Rayquaza ex'; public fullName = 'Mega Rayquaza ex DLR'; public set = 'DLR'; public setNumber = '84';
}
class RayquazaIllustration extends Rayquaza { public fullName = 'Mega Rayquaza ex SIR M6'; public setNumber = '138'; }
class RayquazaGold extends Rayquaza { public fullName = 'Mega Rayquaza ex MHR M6'; public setNumber = '141'; }

describe('Delta Reign numbered print normalization', () => {
  let previous: Card[];
  beforeEach(() => {
    previous = StateSerializer.knownCards;
    StateSerializer.setKnownCards([new PyroductLeft(), new PyroductRight(), new Nidoran(), new Kecleon(), new KecleonAlt(), new Rayquaza(), new RayquazaIllustration(), new RayquazaGold()]);
  });
  afterEach(() => StateSerializer.setKnownCards(previous));
  it('keeps the two same-named Stadium halves distinct', () => {
    expect(StateSerializer.normalizeCardName('Legendary Pyroduct DLR 94')).toBe('Legendary Lava Lake (Left) M6');
    expect(StateSerializer.normalizeCardName('Legendary Pyroduct DLR 95')).toBe('Legendary Lava Lake (Right) M6');
  });
  it('retains alternate print identity and accepts a zero-padded collector number', () => {
    expect(StateSerializer.normalizeCardName('Kecleon DLR 083')).toBe('Kecleon M6');
    expect(StateSerializer.normalizeCardName('Kecleon DLR 117')).toBe('Kecleon2 DLR');
  });
  it('maps the upstream Rayquaza alias and matching Japanese illustrations to DLR', () => {
    expect(StateSerializer.normalizeCardName('Mega Rayquaza ex M6')).toBe('Mega Rayquaza ex DLR');
    expect(StateSerializer.normalizeCardName('Mega Rayquaza ex M6 58')).toBe('Mega Rayquaza ex DLR');
    expect(StateSerializer.normalizeCardName('Mega Rayquaza ex M6 110')).toBe('Mega Rayquaza ex SIR M6');
    expect(StateSerializer.normalizeCardName('Mega Rayquaza ex M6 113')).toBe('Mega Rayquaza ex MHR M6');
    expect(StateSerializer.normalizeCardName('Mega Rayquaza ex DLR 138')).toBe('Mega Rayquaza ex SIR M6');
    expect(StateSerializer.normalizeCardName('Mega Rayquaza ex DLR 141')).toBe('Mega Rayquaza ex MHR M6');
  });
  it('accepts either the female symbol or letter used by card data sources', () => {
    expect(StateSerializer.normalizeCardName('Nidoran F DLR 55')).toBe('Nidoran F M6');
    expect(StateSerializer.normalizeCardName('Nidoran ♀ DLR 55')).toBe('Nidoran F M6');
  });
});
