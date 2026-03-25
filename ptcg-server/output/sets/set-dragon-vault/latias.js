"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Latias = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Latias extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 100;
        this.weakness = [{ type: N }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Energy Assist',
                cost: [C],
                damage: 0,
                text: 'Attach a basic Energy card from your discard pile to 1 of your Benched Pok\u00e9mon.'
            },
            {
                name: 'Sky Heal',
                cost: [R, P],
                damage: 40,
                text: 'If Latios is on your Bench, heal 20 damage from this Pok\u00e9mon.'
            }
        ];
        this.set = 'DRV';
        this.setNumber = '9';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Latias';
        this.fullName = 'Latias DRV';
    }
    reduceEffect(store, state, effect) {
        // Energy Assist
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC);
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasEnergyInDiscard || !hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        // Sky Heal
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            let hasLatios = false;
            player.bench.forEach(benchSlot => {
                if (benchSlot.cards.length > 0) {
                    const pokemon = benchSlot.getPokemonCard();
                    if (pokemon && pokemon.name === 'Latios') {
                        hasLatios = true;
                    }
                }
            });
            if (hasLatios) {
                (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(20, effect, store, state);
            }
        }
        return state;
    }
}
exports.Latias = Latias;
