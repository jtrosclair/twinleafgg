"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Falinks = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Falinks extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 90;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Call for Family',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Team Attack',
                cost: [C, C],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each of your Benched pokemon that have "Falinks" in its name.'
            }];
        this.regulationMark = 'D';
        this.set = 'RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.name = 'Falinks';
        this.fullName = 'Falinks RCL';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH)(store, state, effect.player, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 2, allowCancel: false });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Count benched Pokémon that have "Falinks" in their name
            const falinks = player.bench.filter(slot => {
                const c = slot.getPokemonCard();
                return c !== undefined && c.name.indexOf(this.name) !== -1;
            });
            const falinksCount = falinks.length;
            const damage = 30 * falinksCount;
            effect.damage = damage;
        }
        return state;
    }
}
exports.Falinks = Falinks;
