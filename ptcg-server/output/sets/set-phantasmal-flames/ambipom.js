"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ambipom = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Ambipom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Aipom';
        this.cardType = C;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Slap',
                cost: [C, C],
                damage: 50,
                text: ''
            },
            {
                name: 'Dual Tail',
                cost: [C, C, C],
                damage: 0,
                text: 'Discard 2 Energy from this Pokémon, and this attack does 60 damage to each of 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'PFL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Ambipom';
        this.fullName = 'Ambipom M2';
    }
    reduceEffect(store, state, effect) {
        // Dual Tail
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if this Pokémon has at least 2 energy attached
            const energyCount = player.active.cards.filter(card => card.superType === card_types_1.SuperType.ENERGY).length;
            if (energyCount >= 2) {
                state = store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 2, max: 2 }), transfers => {
                    transfers = transfers || [];
                    if (transfers.length === 0) {
                        return state;
                    }
                    // Discard the energy
                    for (const transfer of transfers) {
                        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                        source.moveCardTo(transfer.card, player.discard);
                    }
                    // Count available targets (active + benched Pokémon)
                    const allTargets = [opponent.active, ...opponent.bench].filter(pokemon => pokemon.cards.length > 0);
                    const targetCount = Math.min(2, allTargets.length);
                    if (targetCount === 0) {
                        return state;
                    }
                    // Prompt to choose 2 Pokémon to damage
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, min: targetCount, max: targetCount }), targets => {
                        targets.forEach(target => {
                            const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                            damageEffect.target = target;
                            store.reduceEffect(state, damageEffect);
                        });
                    });
                });
            }
        }
        return state;
    }
}
exports.Ambipom = Ambipom;
