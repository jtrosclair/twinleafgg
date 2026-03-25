"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Marowak = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Marowak extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cubone';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = F;
        this.additionalCardTypes = [M];
        this.hp = 80;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Energy Bone',
                cost: [F, M],
                damage: 0,
                text: 'Choose a number of your opponent\'s Pokémon up to the amount of Energy attached to Marowak. This attack does 20 damage to each of them.'
            },
            {
                name: 'Metal Crusher',
                cost: [F, C, C],
                damage: 50,
                text: 'If the Defending Pokémon is [M] Pokémon, this attack\'s base damage is 90.'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Marowak';
        this.fullName = 'Marowak DS';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardList = player.active;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energies = 0;
            checkProvidedEnergyEffect.energyMap.forEach(energy => { energy.provides.forEach(e => { energies++; }); });
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON)(20, effect, store, state, 0, energies);
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const checkPokemonTypeEffect = new check_effects_1.CheckPokemonTypeEffect(effect.opponent.active);
            store.reduceEffect(state, checkPokemonTypeEffect);
            if (checkPokemonTypeEffect.cardTypes.includes(card_types_1.CardType.METAL)) {
                effect.damage = 90;
            }
        }
        return state;
    }
}
exports.Marowak = Marowak;
