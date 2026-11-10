import { ensureClientCards } from '../../client/cards';
import { CardManager } from '../../game/cards/card-manager';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Card } from '../../game/store/card/card';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { GamePhase, State } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { Lunatone } from '../set-obsidian-flames/lunatone';

describe('Lunatone OBF in the executable simulator catalogue', () => {
  it('registers the official print exactly once with its passive Ability and artwork mapping', () => {
    const matches = ensureClientCards().filter(c => c.fullName === 'Lunatone OBF');
    expect(matches.length).toBe(1);
    const card = matches[0] as PokemonCard;
    expect(card instanceof Lunatone).toBe(true);
    expect([card.set, card.setNumber, card.hp, card.regulationMark]).toEqual(['OBF', '92', 90, 'G']);
    expect([card.powers[0].name, card.powers[0].powerType, card.powers[0].useWhenInPlay])
      .toEqual(['New Moon', PowerType.ABILITY, undefined]);
    const art = require('../../../data/limitlesstcg-images.json');
    expect(art['OBF 92']).toContain('/OBF/OBF_092_R_EN.png');
  });

  it('deserializes real registered Lunatone and Solrock printings and protects against Path', () => {
    ensureClientCards();
    const manager = CardManager.getInstance();
    const names = ['Lunatone OBF', 'Solrock PGO', 'Mew ex MEW', 'Path to the Peak CRE', 'Mew ex MEW'];
    const cards = names.map(name => manager.getCardByName(name));
    expect(cards.every(Boolean)).toBe(true);
    if (cards.some(c => !c)) return;
    cards.forEach((c, index) => { (c as Card).id = index; });
    const [luna, solrock, mew, stadium, opposingMew] = cards as Card[];
    const state = new State(), player = new Player(), opponent = new Player();
    player.id = 1; opponent.id = 2; state.players = [player, opponent];
    state.phase = GamePhase.PLAYER_TURN; state.turn = 3; state.activePlayer = 0; state.cardNames = names;
    player.active.cards = [mew]; opponent.active.cards = [opposingMew]; player.stadium.cards = [stadium];
    const moonSlot = new PokemonCardList(), sunSlot = new PokemonCardList();
    moonSlot.cards = [luna]; sunSlot.cards = [solrock]; player.bench = [moonSlot, sunSlot];
    const serializer = new StateSerializer(), encoded = serializer.serialize(state), restored = serializer.deserialize(encoded);
    expect(serializer.serialize(restored)).toBe(encoded);
    expect(restored.players[0].bench[0].getPokemonCard() instanceof Lunatone).toBe(true);
    expect(restored.players[0].bench[1].getPokemonCard()?.fullName).toBe('Solrock PGO');
    const owner = restored.players[0], active = owner.active.getPokemonCard()!;
    const store = new Store({ onStateChange: () => undefined }); store.state = restored;
    const probe = () => store.reduceEffect(restored, new PowerEffect(owner,
      { name: 'probe', powerType: PowerType.ABILITY, text: '' }, active));
    expect(probe).not.toThrow();
    owner.bench[1].cards = [];
    expect(probe).toThrow();
  });
});
