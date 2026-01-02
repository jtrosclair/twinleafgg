"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketsZapdos = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class RocketsZapdos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.ROCKETS];
        this.cardType = L;
        this.hp = 70;
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Plasma',
                cost: [L],
                damage: 20,
                text: 'If there are any [L] Energy cards in your discard pile, attach 1 of them to Rocket\'s Zapdos.'
            },
            {
                name: 'Electroburn',
                cost: [L, L, L, C],
                damage: 70,
                text: 'Rocket\'s Zapdos does damage to itself equal to 10 times the number of [L] Energy cards attached to it.'
            }];
        this.set = 'G2';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Rocket\'s Zapdos';
        this.fullName = 'Rocket\'s Zapdos G2';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.discard.cards.some(card => card instanceof game_1.EnergyCard && card.name === 'Lightning Energy')) {
                state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, name: 'Lightning Energy' }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                    transfers = transfers || [];
                    // cancelled by user
                    if (transfers.length === 0) {
                        return;
                    }
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.discard.moveCardTo(transfer.card, target);
                    }
                });
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const checkProvided = new check_effects_1.CheckProvidedEnergyEffect(effect.player, effect.player.active);
            store.reduceEffect(state, checkProvided);
            const lightningCount = checkProvided.energyMap.filter(e => e.provides.includes(card_types_1.CardType.LIGHTNING)).length;
            prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10 * lightningCount);
        }
        return state;
    }
}
exports.RocketsZapdos = RocketsZapdos;
