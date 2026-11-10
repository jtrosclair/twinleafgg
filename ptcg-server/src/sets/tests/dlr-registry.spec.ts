import { StateSerializer } from '../../game/serializer/state-serializer';
import { setDeltaReign } from '../set-delta-reign';
import * as fs from 'fs';
import * as path from 'path';

const names = [
  'Heracross','Surskit','Masquerain','Cacnea','Cacturne','Combee','Vespiquen','Shaymin','Virizion','Wimpod',
  'Mega Golisopod ex','Sprigatito','Floragato','Meowscarada ex','Smoliv','Dolliv','Arboliva','Growlithe','Arcanine',
  'Magmar','Magmortar','Torkoal','Heat Rotom ex','Heatmor','Mantine','Kyogre','Frillish','Jellicent','Wishiwashi ex',
  'Electabuzz','Electivire','Jolteon','Raikou ex','Rotom','Thundurus','Pincurchin','Pawmi','Pawmo','Pawmot','Wattrel',
  'Kilowattrel','Miraidon','Drowzee','Hypno','Giratina','Golett','Mega Golurk ex','Enamorus','Sandshrew','Sandslash',
  'Onix','Steelix','Groudon','Landorus','Nidoran F','Nidorina','Nidoqueen','Spinarak','Ariados','Sableye','Carvanha',
  'Sharpedo','Darkrai','Purrloin','Liepard','Zorua','Zoroark ex','Inkay','Mega Malamar ex','Morpeko','Zarude','Druddigon',
  'Jangmo-o','Hakamo-o','Kommo-o','Cyclizar','Tauros','Eevee','Delibird','Azurill','Swablu','Altaria','Kecleon',
  'Mega Rayquaza ex','Tornadus','Fletchling','Fletchinder','Talonflame ex','Aarune','Adventure Lantern','Custom Vest',
  "Emcee's Hype",'Grisham','Legendary Pyroduct','Legendary Pyroduct','Legendary Summit','Legendary Summit',
  'Legendary Trench','Legendary Trench','Mega Rayquaza Cap','Tasty Rice Ball',"Tate & Liza's Training","Zinnia's Trust",
  'Masquerain','Sprigatito','Growlithe','Magmortar','Electivire','Pincurchin','Enamorus','Groudon','Zorua','Inkay',
  'Eevee','Azurill','Altaria','Kecleon','Mega Golisopod ex','Heat Rotom ex','Wishiwashi ex','Raikou ex','Mega Golurk ex',
  'Mega Malamar ex','Talonflame ex','Aarune','Adventure Lantern','Custom Vest',"Emcee's Hype",'Pokémon Catcher',
  "Tate & Liza's Training","Zinnia's Trust",'Bubbly Water Energy','Growing Grass Energy','Nitro Fire Energy',
  'Mega Golisopod ex','Raikou ex','Mega Golurk ex','Mega Rayquaza ex','Aarune',"Zinnia's Trust",'Mega Rayquaza ex'
];

describe('complete Delta Reign catalogue', () => {
  let previous: typeof StateSerializer.knownCards;
  beforeEach(() => { previous = StateSerializer.knownCards; StateSerializer.setKnownCards(setDeltaReign); });
  afterEach(() => StateSerializer.setKnownCards(previous));
  it('registers every collector number exactly once with a unique executable identity', () => {
    expect(names.length).toBe(141);
    expect(setDeltaReign.length).toBe(141);
    expect(new Set(setDeltaReign.map(card => card.fullName)).size).toBe(141);
    expect(setDeltaReign.map(card => Number(card.setNumber))).toEqual(Array.from({length: 141}, (_, i) => i + 1));
    expect(setDeltaReign.every(card => card.set === 'DLR')).toBe(true);
  });
  it('has a distinct existing artwork URL for every print in browser metadata', () => {
    const images: { [key: string]: string } = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data/limitlesstcg-images.json'), 'utf8'));
    for (const card of setDeltaReign) {
      const number = card.setNumber.padStart(3, '0');
      expect(images[card.usSetNumber || card.set + ' ' + card.setNumber]).toContain('/DLR_' + number + '_');
    }
  });
  names.forEach((name, index) => it('resolves the printed identity and artwork for DLR ' + (index + 1), () => {
    const number = index + 1;
    const card = setDeltaReign.find(item => Number(item.setNumber) === number)!;
    expect(StateSerializer.normalizeCardName(name + ' DLR ' + number)).toBe(card.fullName);
    expect(card.usSetNumber || card.set + ' ' + card.setNumber).toBe('DLR ' + number);
  }));
});
