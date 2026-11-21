import { GameError, GameMessage, SelectPrompt } from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Power, PowerType } from '../../game/store/card/pokemon-types';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { knockOutAndAttachAsEnergy } from '../../game/store/prefabs/knock-out-as-energy';
import { recoilAfterAttack } from '../../game/store/prefabs/recoil-after-attack';
import {
  BLOCK_IF_ASLEEP_CONFUSED_PARALYZED, COIN_FLIP_PROMPT, IS_POKEPOWER_BLOCKED,
  WAS_ATTACK_USED, WAS_POWER_USED,
} from '../../game/store/prefabs/prefabs';

const energyChoices = [
  { type: CardType.COLORLESS, label: 'Colorless' },
  { type: CardType.DARK, label: 'Dark' },
  { type: CardType.DRAGON, label: 'Dragon' },
  { type: CardType.FAIRY, label: 'Fairy' },
  { type: CardType.FIGHTING, label: 'Fighting' },
  { type: CardType.FIRE, label: 'Fire' },
  { type: CardType.GRASS, label: 'Grass' },
  { type: CardType.LIGHTNING, label: 'Lightning' },
  { type: CardType.METAL, label: 'Metal' },
  { type: CardType.PSYCHIC, label: 'Psychic' },
  { type: CardType.WATER, label: 'Water' },
];

export class Electrode extends PokemonCard implements EnergyCard {
  public name = 'Electrode';
  public set = 'BS';
  public fullName = 'Electrode BS';
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Voltorb';
  public cardType = CardType.LIGHTNING;
  public cardImage = 'assets/cardback.png';
  public setNumber = '21';
  public hp = 80;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public powers: Power[] = [{
    powerType: PowerType.POKEMON_POWER,
    useWhenInPlay: true,
    name: 'Buzzap',
    text: 'At any time during your turn (before your attack), you may Knock Out Electrode and attach it to 1 of your other Pokémon. If you do, choose a type of Energy. Electrode is now an Energy card (instead of a Pokémon) that provides 2 energy of that type. You can\'t use this power if Electrode is Asleep, Confused, or Paralyzed.',
  }];

  public attacks = [{
    name: 'Electric Shock',
    cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
    damage: 50,
    text: 'Flip a coin. If tails, Electrode does 10 damage to itself.',
  }];

  public provides: CardType[] = [];
  public energyType = EnergyType.SPECIAL;
  public get chosenEnergyType(): CardType | undefined { return this.provides[0]; }
  public text = '';
  public isBlocked = false;
  public blendedEnergies: CardType[] = [];
  public blendedEnergyCount = 1;
  public energyEffect: EnergyCard['energyEffect'];

  public isEnergyWhenAttached(): boolean {
    return this.chosenEnergyType !== undefined;
  }

  public getAttachedEnergyChoice(): CardType | undefined {
    return this.superType === SuperType.ENERGY ? this.provides[0] : undefined;
  }

  public restoreAttachedEnergyChoice(choice: CardType): void {
    if (!energyChoices.some(option => option.type === choice)) return;
    this.provides = [choice, choice];
  }

  public clearAttachedEnergyForm(): void {
    if (this.superType !== SuperType.ENERGY) return;
    this.superType = SuperType.POKEMON;
    this.provides = [];
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-evolutions/electrode.ts (Buzzap Thunder).
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, this);
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      if (player.getPokemonInPlay().length < 2) throw new GameError(GameMessage.CANNOT_USE_POWER);

      return store.prompt(state, new SelectPrompt(
        player.id, GameMessage.CHOOSE_ENERGY_TYPE, energyChoices.map(option => option.label), { allowCancel: false },
      ), (index: number) => {
        const option = energyChoices[index];
        if (!option) throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
        // Each physical attachment stores the choice, including through an Energy transfer.
        knockOutAndAttachAsEnergy(store, state, player, this, [option.type, option.type]);
      });
    }

    if (effect instanceof CheckProvidedEnergyEffect && this.superType === SuperType.ENERGY
      && effect.source.energies.cards.includes(this)) {
      effect.energyMap.push({ card: this, provides: this.provides.slice() });
    }

    // Ref: set-heartgold-and-soulsilver/pikachu.ts (coin flip followed by recoil).
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, heads => {
        if (!heads) recoilAfterAttack(state, effect, 10);
      });
    }
    return state;
  }
}
