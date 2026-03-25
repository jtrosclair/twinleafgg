"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Probopass = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const move_energy_prompt_1 = require("../../game/store/prompts/move-energy-prompt");
class Probopass extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Nosepass';
        this.cardType = M;
        this.hp = 110;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [C, C, C, C];
        this.attacks = [
            {
                name: 'Magnetic Lines',
                cost: [C, C],
                damage: 30,
                text: 'You may move an Energy attached to the Defending Pokémon to 1 of your opponent\'s Benched Pokémon.'
            },
            {
                name: 'Heavy Nose',
                cost: [M, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'If the Defending Pokémon already has any damage counters on it, this attack does 30 more damage.'
            }
        ];
        this.set = 'DRX';
        this.setNumber = '82';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Probopass';
        this.fullName = 'Probopass DRX';
    }
    reduceEffect(store, state, effect) {
        // Magnetic Lines - optionally move an Energy from the Defending Pokemon to opponent's bench
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active;
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            const hasEnergy = opponentActive.cards.some(c => c.superType === card_types_1.SuperType.ENERGY);
            if (!hasBench || !hasEnergy) {
                return state;
            }
            // Build blocked targets: can only move FROM active, TO bench
            const blockedTo = [];
            const blockedFrom = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList === opponentActive) {
                    blockedTo.push(target);
                    return;
                }
                blockedFrom.push(target);
            });
            return store.prompt(state, new move_energy_prompt_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: true, blockedFrom, blockedTo }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, opponent, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, opponent, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
            });
        }
        // Heavy Nose - more damage if Defending already has damage counters
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (opponent.active.damage > 0) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.Probopass = Probopass;
