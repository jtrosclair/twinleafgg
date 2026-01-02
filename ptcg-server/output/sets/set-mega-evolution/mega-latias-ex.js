"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaLatiasex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaLatiasex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_SV_MEGA];
        this.hp = 280;
        this.cardType = N;
        this.retreat = [C];
        this.attacks = [{
                name: 'Strafe',
                cost: [C],
                damage: 40,
                text: 'You may switch this Pokémon with one of your Benched Pokémon.'
            },
            {
                name: 'Mirage Pulse',
                cost: [R, P, C],
                damage: 300,
                text: 'Discard all Energy from this Pokémon.'
            }];
        this.regulationMark = 'I';
        this.set = 'MEG';
        this.setNumber = '100';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Latias ex';
        this.fullName = 'Mega Latias ex M1S';
        this.strafeUsed = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.strafeUsed = true;
        }
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && this.strafeUsed) {
            this.strafeUsed = false;
            const player = effect.player;
            if (player.bench.length > 0) {
                store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToSwitch => {
                    if (wantToSwitch) {
                        prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
                    }
                });
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.movedToActiveThisTurn = false;
        }
        return state;
    }
}
exports.MegaLatiasex = MegaLatiasex;
