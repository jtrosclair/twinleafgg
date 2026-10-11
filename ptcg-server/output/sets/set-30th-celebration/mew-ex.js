"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mewex = void 0;
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const copy_attack_prefabs_1 = require("../../game/store/prefabs/copy-attack-prefabs");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Mewex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.hp = 160;
        this.cardType = game_1.CardType.PSYCHIC;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Memory Helix',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon can use the attacks of any of your Benched Pokémon. (You still need the necessary Energy to use each attack.)',
            }];
        this.attacks = [{
                name: 'Teleportation Burst',
                cost: [game_1.CardType.PSYCHIC],
                damage: 30,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon.',
            }];
        this.regulationMark = 'J';
        this.set = 'M6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
        this.name = 'Mew ex';
        this.fullName = 'Mew ex 30C';
        this.usSetNumber = '30C 66';
    }
    reduceEffect(store, state, effect) {
        // Memory Helix
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            return (0, copy_attack_prefabs_1.COPY_ATTACK_VIA_ABILITY)(store, state, effect, {
                copycatCard: this,
                filter: (cardList) => cardList !== player.active,
            });
        }
        // Teleportation Burst
        if (effect instanceof game_phase_effects_1.AfterAttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.bench.some((b) => b.cards.length > 0)) {
                store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), (wantToSwitch) => {
                    if (wantToSwitch) {
                        (0, prefabs_1.SWITCH_ACTIVE_WITH_BENCHED)(store, state, player);
                    }
                });
            }
        }
        return state;
    }
}
exports.Mewex = Mewex;
