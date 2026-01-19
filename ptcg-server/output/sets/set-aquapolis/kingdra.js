"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kingdra = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Kingdra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Seadra';
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Water Cyclone',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'As often as you like during your turn (before your attack), you may move a [W] Energy card from your Active Pokémon to 1 of your Benched Pokémon. This power can\'t be used if Kingdra is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Rapids',
                cost: [W, W, C, C],
                damage: 50,
                text: 'Flip a coin. If heads, discard 1 Energy card attached to the Defending Pokémon, if any.'
            }];
        this.set = 'AQ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Kingdra';
        this.fullName = 'Kingdra AQ';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            // Block all energy on bench (can't move from bench)
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (target.slot === game_1.SlotType.BENCH) {
                    // Block all cards on bench
                    blockedMap.push({ source: target, blocked: cardList.cards.map((_, i) => i) });
                }
            });
            // Only allow moving to bench (can't move to active)
            const blockedTo = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (target.slot === game_1.SlotType.ACTIVE) {
                    blockedTo.push(target);
                }
            });
            return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], // Allow moving from active to bench
            { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, blockedMap, blockedTo }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                    if (result) {
                        store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                            const card = selected[0];
                            (0, prefabs_1.MOVE_CARDS)(store, state, game_1.StateUtils.findCardList(state, card), opponent.discard, { cards: [card], sourceCard: this, sourceEffect: this.attacks[0] });
                            return state;
                        });
                    }
                });
            }
        }
        return state;
    }
}
exports.Kingdra = Kingdra;
