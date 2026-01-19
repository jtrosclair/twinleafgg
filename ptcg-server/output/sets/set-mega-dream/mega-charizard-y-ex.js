"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegaCharizardYex = void 0;
const game_1 = require("../../game");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MegaCharizardYex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Charmeleon';
        this.tags = [game_1.CardTag.POKEMON_SV_MEGA, game_1.CardTag.POKEMON_ex];
        this.cardType = R;
        this.hp = 360;
        this.weakness = [{ type: W }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Plosion Y',
                cost: [R, R, C],
                damage: 0,
                text: 'Discard 3 Energy from this Pokemon. This attack does 280 damage to 1 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            }];
        this.regulationMark = 'I';
        this.set = 'MC';
        this.setNumber = '85';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mega Charizard Y ex';
        this.fullName = 'Mega Charizard Y ex MC';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check how many energy cards are attached to this Pokemon
            const energyCount = player.active.cards.filter(card => card instanceof game_1.EnergyCard).length;
            if (energyCount < 3) {
                // Not enough energy, can't use attack
                return state;
            }
            // Discard exactly 3 energy from this Pokemon only
            return store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], // Only from active Pokemon (this Pokemon)
            { superType: game_1.SuperType.ENERGY }, { min: 3, max: 3, allowCancel: false }), transfers => {
                if (transfers === null || transfers.length !== 3) {
                    return;
                }
                // Discard the selected energy cards
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    source.moveCardTo(transfer.card, player.discard);
                }
                // Check if opponent has any Pokemon
                const hasPokemon = opponent.active.cards.length > 0 ||
                    opponent.bench.some(b => b.cards.length > 0);
                if (!hasPokemon) {
                    return state;
                }
                // Prompt to choose 1 opponent Pokemon (active or bench)
                return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                    const targets = selected || [];
                    (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 280, targets);
                });
            });
        }
        return state;
    }
}
exports.MegaCharizardYex = MegaCharizardYex;
