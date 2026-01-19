"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arceus = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Arceus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.tags = [card_types_1.CardTag.ARCEUS];
        this.powers = [{
                name: 'Arceus Rule',
                powerType: game_1.PowerType.ARCEUS_RULE,
                text: 'You may have as many of this card in your deck as you like.'
            }];
        this.attacks = [
            {
                name: 'Ripple Swell',
                cost: [],
                damage: 0,
                text: 'If you have 6 Arceus in play and each of them is a different type, search your deck for up to 6 basic Energy cards. Attach each of those Energy cards to a different Pokémon you have in play. Shuffle your deck afterward'
            },
            {
                name: 'Sky Spear',
                cost: [C, C, C],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Pokémon. This attack does 80 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Remove all Energy cards attached to Arceus and put them in the Lost Zone'
            }
        ];
        this.set = 'AR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = 'AR5';
        this.name = 'Arceus';
        this.fullName = 'Arceus AR';
    }
    reduceEffect(store, state, effect) {
        // Ripple Swell
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let arceusInPlay = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, card => {
                var _a;
                if (((_a = card.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === 'Arceus') {
                    arceusInPlay++;
                }
            });
            if (arceusInPlay !== 6) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 6, differentTargets: true }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    (0, prefabs_1.MOVE_CARDS)(store, state, player.deck, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.attacks[0] });
                }
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        // Sky Spear
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            (0, attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON)(80, effect, store, state);
            const energies = player.active.cards.filter(card => card instanceof game_1.EnergyCard);
            (0, prefabs_1.MOVE_CARDS)(store, state, player.active, player.lostzone, { cards: energies });
        }
        return state;
    }
}
exports.Arceus = Arceus;
