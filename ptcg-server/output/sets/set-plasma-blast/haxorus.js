"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haxorus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Haxorus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Fraxure';
        this.cardType = N;
        this.hp = 140;
        this.weakness = [{ type: N }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Dragonaxe',
                cost: [M],
                damage: 40,
                damageCalculation: 'x',
                text: 'Does 40 damage times the amount of [M] Energy attached to this Pokémon.'
            },
            {
                name: 'Strike of the Champion',
                cost: [F, M],
                damage: 0,
                text: 'If the Defending Pokémon is a Team Plasma Pokémon, it is Knocked Out. (If the Defending Pokémon is not a Team Plasma Pokémon, this attack does nothing.)'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '69';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Haxorus';
        this.fullName = 'Haxorus PLB';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Dragonaxe
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkEnergy);
            let metalCount = 0;
            checkEnergy.energyMap.forEach(em => {
                metalCount += em.provides.filter(p => p === card_types_1.CardType.METAL || p === card_types_1.CardType.ANY).length;
            });
            effect.damage = 40 * metalCount;
        }
        // Attack 2: Strike of the Champion
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defendingCard = opponent.active.getPokemonCard();
            if (defendingCard && defendingCard.tags.includes(card_types_1.CardTag.TEAM_PLASMA)) {
                // Ref: set-shrouded-fable/haxorus.ts (direct KO attack effect)
                return (0, attack_effects_1.KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON)(store, state, effect);
            }
        }
        return state;
    }
}
exports.Haxorus = Haxorus;
