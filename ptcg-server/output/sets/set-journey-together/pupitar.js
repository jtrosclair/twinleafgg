"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pupitar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pupitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Larvitar';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Take Down',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'This Pokémon also does 20 damage to itself.'
            }
        ];
        this.set = 'JTG';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Pupitar';
        this.fullName = 'Pupitar JTG';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
            damageEffect.target = player.active;
            store.reduceEffect(state, damageEffect);
        }
        return state;
    }
}
exports.Pupitar = Pupitar;
