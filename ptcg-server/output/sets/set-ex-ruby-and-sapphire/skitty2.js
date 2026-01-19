"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skitty2 = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Skitty2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Minor Errand-Running',
                cost: [C],
                damage: 0,
                text: 'Search your deck for 2 basic Energy cards, show them to your opponent, and put them into your hand. Shuffle your deck afterward.'
            },
            {
                name: 'Lullaby',
                cost: [C],
                damage: 10,
                text: 'The Defending Pokémon is now Asleep.'
            }];
        this.set = 'RS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Skitty';
        this.fullName = 'Skitty RS2';
        this.legacyFullName = 'Skitty RS 44';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }), selected => {
                if (selected) {
                    (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, opponent, selected);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, player.hand, { cards: selected });
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP)(store, state, effect);
        }
        return state;
    }
}
exports.Skitty2 = Skitty2;
