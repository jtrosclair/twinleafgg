"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wugtrioex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const marker_constants_1 = require("../../game/store/markers/marker-constants");
class Wugtrioex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Wiglett';
        this.cardType = L;
        this.hp = 250;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Tricolor Pump',
                cost: [W],
                damage: 0,
                text: 'Discard up to 3 Energy cards from your hand. This attack does 60 damage to 1 of your opponent\'s Pokémon for each Energy card you discarded in this way. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Numbing Hold',
                cost: [W, W],
                damage: 120,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            }];
        this.set = 'TEF';
        this.name = 'Wugtrio ex';
        this.fullName = 'Wugtrio ex TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
    }
    reduceEffect(store, state, effect) {
        // Tricolor Pump
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let watersCount = 0;
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 3 }), cards => {
                cards = cards || [];
                watersCount = cards.length;
                player.hand.moveCardsTo(cards, player.discard);
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                const targets = selected || [];
                (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 60 * watersCount, targets);
            });
        }
        // Numbing Hold
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            return (0, prefabs_1.BLOCK_RETREAT)(store, state, effect, this);
        }
        (0, prefabs_1.BLOCK_RETREAT_IF_MARKER)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN)(effect, marker_constants_1.MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        (0, prefabs_1.TERA_RULE)(effect, state, this);
        return state;
    }
}
exports.Wugtrioex = Wugtrioex;
