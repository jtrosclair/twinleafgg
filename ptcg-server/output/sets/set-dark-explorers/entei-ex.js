"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnteiEx = void 0;
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const card_types_1 = require("../../game/store/card/card-types");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
class EnteiEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.cardType = R;
        this.hp = 180;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Fire Fang',
                cost: [R, C],
                damage: 30,
                text: 'The Defending Pokémon is now Burned.'
            },
            {
                name: 'Grand Flame',
                cost: [R, R, C],
                damage: 90,
                text: 'Attach a [R] Energy card from your discard pile to 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'DEX';
        this.setNumber = '13';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Entei-EX';
        this.fullName = 'Entei EX DEX';
    }
    reduceEffect(store, state, effect) {
        // Fire Fang - applies burn
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, effect.opponent, this);
        }
        // Grand Flame - attach Fire Energy from discard to a benched Pokémon
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            // Check if there's Fire Energy in discard
            const hasFireEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.name === 'Fire Energy';
            });
            // Check if there are any benched Pokémon
            const hasBenchedPokemon = player.bench.some(b => b.cards.length > 0);
            if (!hasFireEnergyInDiscard || !hasBenchedPokemon) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, target, { cards: [transfer.card] });
                }
            });
        }
        return state;
    }
}
exports.EnteiEx = EnteiEx;
