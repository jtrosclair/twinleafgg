"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tropius = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tropius extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Leaf Drain',
                cost: [G],
                damage: 20,
                text: 'Heal 20 damage from this Pokémon.'
            },
            {
                name: 'Tropic Breeze',
                cost: [G, G, C],
                damage: 130,
                text: 'Move all Energy from this Pokémon to 1 of your Benched Pokémon.'
            }];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Tropius';
        this.fullName = 'Tropius PAL';
        this.regulationMark = 'G';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(effect, store, state, 20);
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 1, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            // Get attached energy cards
            const attachedEnergies = player.active.cards.filter(card => {
                return card.superType === card_types_1.SuperType.ENERGY;
            });
            store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: attachedEnergies.length, max: attachedEnergies.length, sameTarget: true }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.Tropius = Tropius;
