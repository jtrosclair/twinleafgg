"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vanilluxe = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
class Vanilluxe extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Vanillish';
        this.cardType = W;
        this.hp = 130;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'ChillMAX',
                cost: [C],
                damage: 60,
                damageCalculation: 'x',
                text: 'Flip a coin for each Energy attached to this Pokémon. This attack does 60 damage for each heads.'
            },
            {
                name: 'Cold Breath',
                cost: [W, C],
                damage: 40,
                text: 'The Defending Pokémon is now Asleep.'
            }
        ];
        this.set = 'PLF';
        this.setNumber = '29';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vanilluxe';
        this.fullName = 'Vanilluxe PLF';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: ChillMAX - flip coin per energy, 60x heads
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            // Count energy attached
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkEnergy);
            const energyCount = checkEnergy.energyMap.length;
            if (energyCount === 0) {
                effect.damage = 0;
                return state;
            }
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, energyCount, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 60 * heads;
            });
        }
        // Attack 2: Cold Breath
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Vanilluxe = Vanilluxe;
