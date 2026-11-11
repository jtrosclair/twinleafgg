import { getCardByName } from './test-helpers';

describe('round 27 native-set discovery', () => {
  // Deliberately do not pre-register the complete catalogue: the test helper
  // must find native files referenced by the late-registration aggregator.
  for (const [name, set, number] of [
    ['Electrike AR 62', 'AR', '62'], ['Phanpy P2', 'P2', '15'], ['Ivysaur P3', 'P3', '14'],
    ['Mudkip P4', 'P4', '11'], ['Charmander δ P5', 'P5', '10'], ['Cherrim P8', 'P8', '6'],
    ['Exeggcute HS', 'HS', '63'], ['Plusle HSP', 'HSP', '16'], ['Aron RR', 'RR', '57'],
    ['Rhydon SV', 'SV', '80']
  ]) it('finds the correct physical printing: ' + name, () => {
    const card = getCardByName(name);
    expect([card.fullName, card.set, card.setNumber]).toEqual([name, set, number]);
  });
});
