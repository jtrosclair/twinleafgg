"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simipour = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const move_energy_prompt_1 = require("../../game/store/prompts/move-energy-prompt");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Simipour extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Panpour';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Grass\' Power',
                cost: [C, C],
                damage: 30,
                text: 'If this Pokémon has any [G] Energy attached to it, heal 20 damage from this Pokémon.'
            },
            {
                name: 'Rushing Water',
                cost: [W, C, C],
                damage: 60,
                text: 'Move an Energy attached to the Defending Pokémon to 1 of your opponent\'s Benched Pokémon.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '23';
        this.name = 'Simipour';
        this.fullName = 'Simipour EPO';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const hasGrassEnergy = player.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && c.provides.includes(card_types_1.CardType.GRASS));
            if (hasGrassEnergy) {
                (0, attack_effects_1.HEAL_X_DAMAGE_FROM_THIS_POKEMON)(20, effect, store, state);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active;
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            const hasEnergy = opponentActive.cards.some(c => c.superType === card_types_1.SuperType.ENERGY);
            if (!hasBench || !hasEnergy) {
                return state;
            }
            const blockedTo = [];
            const blockedFrom = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList === opponentActive) {
                    blockedTo.push(target);
                    return;
                }
                blockedFrom.push(target);
            });
            return store.prompt(state, new move_energy_prompt_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blockedFrom, blockedTo }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, opponent, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, opponent, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.Simipour = Simipour;
