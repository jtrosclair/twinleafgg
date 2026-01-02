"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cinderace = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cinderace extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Raboot';
        this.tags = [card_types_1.CardTag.PLAY_DURING_SETUP];
        this.cardType = R;
        this.hp = 160;
        this.weakness = [{ type: W }];
        this.retreat = [];
        this.powers = [{
                name: 'Explosiveness',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in your hand when you are setting up to play, you may put it face down as your Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Flame Turbo',
                cost: [C],
                damage: 50,
                text: 'Search your deck for up to 3 Basic Energy cards and attach them to your Benched Pokémon in any way you like. Then, shuffle your deck.'
            }];
        this.set = 'MEG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Cinderace';
        this.fullName = 'Cinderace M1L';
        this.regulationMark = 'I';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 3 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    prefabs_1.SHUFFLE_DECK(store, state, player);
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
            });
            prefabs_1.SHUFFLE_DECK(store, state, player);
        }
        return state;
    }
}
exports.Cinderace = Cinderace;
