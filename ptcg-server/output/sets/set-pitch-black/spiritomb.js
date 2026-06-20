"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spiritomb = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const ghost_veil_1 = require("./ghost-veil");
class Spiritomb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 60;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Soul End',
                cost: [P],
                damage: 0,
                text: 'If you have 13 or more Pokémon in your discard with the Ghost Veil Ability, choose 2 of your opponent\'s Pokémon and quadruple the number of damage counters on each of them.',
            }];
        this.set = 'M5';
        this.setNumber = '33';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Spiritomb';
        this.fullName = 'Spiritomb M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-dark-explorers/kyogre-ex.ts (Dual Splash — choose opponent Pokémon incl. Active)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            effect.damage = 0;
            if ((0, ghost_veil_1.countGhostVeilPokemonInDiscard)(player) < 13) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 2, max: 2, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const current = target.damage;
                    if (current <= 0) {
                        return;
                    }
                    const add = current * 3;
                    store.reduceEffect(state, new game_effects_1.PlaceDamageCountersEffect(player, target, add, this));
                });
            });
        }
        return state;
    }
}
exports.Spiritomb = Spiritomb;
