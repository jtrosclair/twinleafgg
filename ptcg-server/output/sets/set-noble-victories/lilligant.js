"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lilligant = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_phase_effects_2 = require("../../game/store/effects/game-phase-effects");
class Lilligant extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Petilil';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Aromax',
                cost: [G],
                damage: 0,
                text: 'Heal all damage from 1 of your Benched Pokémon.'
            },
            {
                name: 'Windmill',
                cost: [G, C],
                damage: 30,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'NVI';
        this.setNumber = '5';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lilligant';
        this.fullName = 'Lilligant NVI';
        this.usedWindmill = false;
    }
    reduceEffect(store, state, effect) {
        // Aromax - heal all damage from benched Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_HEAL, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    targets[0].damage = 0;
                }
            });
        }
        // Windmill - mark for switching after attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            this.usedWindmill = true;
        }
        // After Windmill attack, switch self with benched
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.usedWindmill) {
            this.usedWindmill = false;
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (hasBenched) {
                (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
            }
        }
        // Cleanup
        if (effect instanceof game_phase_effects_2.EndTurnEffect && this.usedWindmill) {
            this.usedWindmill = false;
        }
        return state;
    }
}
exports.Lilligant = Lilligant;
