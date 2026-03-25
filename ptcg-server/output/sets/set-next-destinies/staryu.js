"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staryu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Staryu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Recover',
                cost: [C],
                damage: 0,
                text: 'Discard an Energy attached to this Pokémon and heal all damage from this Pokémon.'
            },
            {
                name: 'Water Gun',
                cost: [W],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'NXD';
        this.setNumber = '23';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Staryu';
        this.fullName = 'Staryu NXD';
    }
    reduceEffect(store, state, effect) {
        // Recover
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                    discardEnergy.target = player.active;
                    store.reduceEffect(state, discardEnergy);
                    // Heal all damage
                    const healAmount = player.active.damage;
                    if (healAmount > 0) {
                        const healEffect = new attack_effects_1.HealTargetEffect(effect, healAmount);
                        healEffect.target = player.active;
                        store.reduceEffect(state, healEffect);
                    }
                }
            });
        }
        return state;
    }
}
exports.Staryu = Staryu;
