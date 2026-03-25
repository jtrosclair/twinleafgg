"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ampharos = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Ampharos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Flaaffy';
        this.cardType = L;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Electromagnetic Wall',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokemon is your Active Pokemon, whenever your opponent attaches an Energy from his or her hand to 1 of his or her Pokemon, put 3 damage counters on that Pokemon.'
            }];
        this.attacks = [
            {
                name: 'Electrobullet',
                cost: [L, C, C],
                damage: 70,
                text: 'Does 20 damage to 1 of your opponent\'s Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '40';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ampharos';
        this.fullName = 'Ampharos DRX';
    }
    reduceEffect(store, state, effect) {
        // Ability: Electromagnetic Wall - damage when opponent attaches energy from hand
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            // Only trigger on energy from hand
            if (!effect.player.hand.cards.includes(effect.energyCard)) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            // Must be in play and active
            if (!game_1.StateUtils.isPokemonInPlay(owner, this) || !owner.active.cards.includes(this)) {
                return state;
            }
            // Check if ability is blocked
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, owner, this)) {
                return state;
            }
            // Only trigger on opponent's energy attachments
            if (effect.player === owner) {
                return state;
            }
            // Put 3 damage counters on the Pokemon that energy is being attached to
            effect.target.damage += 30;
        }
        // Attack: Electrobullet - 70 to active, 20 to a benched
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON)(20, effect, store, state);
        }
        return state;
    }
}
exports.Ampharos = Ampharos;
