"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Torkoal = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Torkoal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Flame Cloak',
                cost: [C],
                damage: 10,
                text: 'Flip a coin. If heads, attach a [R] Energy card from your discard pile to this Pokémon.'
            },
            {
                name: 'Heat Blast',
                cost: [R, C, C],
                damage: 60,
                text: ''
            }
        ];
        this.set = 'DEX';
        this.setNumber = '18';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Torkoal';
        this.fullName = 'Torkoal DEX';
    }
    reduceEffect(store, state, effect) {
        // Flame Cloak
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            return (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (!result) {
                    return;
                }
                const fireEnergy = player.discard.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY &&
                    c.energyType === card_types_1.EnergyType.BASIC &&
                    c.name === 'Fire Energy');
                if (fireEnergy.length === 0) {
                    return;
                }
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 0, max: 1, allowCancel: true }), selected => {
                    if (selected && selected.length > 0) {
                        player.discard.moveCardTo(selected[0], player.active);
                    }
                });
            });
        }
        return state;
    }
}
exports.Torkoal = Torkoal;
