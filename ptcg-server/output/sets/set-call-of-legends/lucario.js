"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lucario = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lucario extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Riolu';
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Dimension Sphere',
                cost: [C, C],
                damage: 30,
                damageCalculation: '+',
                text: 'Does 30 damage plus 20 more damage for each of your Pokémon in the Lost Zone.'
            },
            {
                name: 'Sky Uppercut',
                cost: [F, F, C],
                damage: 70,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }];
        this.set = 'CL';
        this.setNumber = '14';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lucario';
        this.fullName = 'Lucario CL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let pokemonCount = 0;
            player.lostzone.cards.forEach(c => {
                if (c instanceof pokemon_card_1.PokemonCard /* && !c.tags.includes(CardTag.PRISM_STAR)*/) {
                    pokemonCount += 1;
                }
            });
            effect.damage += pokemonCount * 20;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.ignoreResistance = true;
        }
        return state;
    }
}
exports.Lucario = Lucario;
