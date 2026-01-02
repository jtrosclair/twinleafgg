"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gorebyss = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gorebyss extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Clamperl';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Crescendo Wave',
                cost: [W],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each [W] Energy attached to this Pokémon. Before doing damage, you may attach as many Basic [W] Energy cards as you like from your hand to this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
        this.name = 'Gorebyss';
        this.fullName = 'Gorebyss DRI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const energiesInHand = player.hand.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Water Energy');
            if (energiesInHand.length > 0) {
                prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, result => {
                    if (result) {
                        state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: false, min: 0 }), transfers => {
                            transfers = transfers || [];
                            if (transfers.length === 0) {
                                return state;
                            }
                            for (const transfer of transfers) {
                                const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                                player.hand.moveCardTo(transfer.card, target);
                            }
                        });
                    }
                });
            }
            const energies = player.active.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Water Energy');
            effect.damage = energies.length * 30;
        }
        return state;
    }
}
exports.Gorebyss = Gorebyss;
