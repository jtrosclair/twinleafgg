"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMagmasClaydol = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamMagmasClaydol extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Magma\'s Baltoy';
        this.tags = [card_types_1.CardTag.TEAM_MAGMA];
        this.cardType = P;
        this.additionalCardTypes = [D];
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Magma Switch',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may move an Energy card attached to your Pokémon with Team Magma in its name to another of your Pokémon. This power can\'t be used if Team Magma\'s Claydol is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Dark Hand',
                cost: [P, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'If you have more cards in your hand than your opponent, this attack does 40 damage plus 20 more damage.'
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Team Magma\'s Claydol';
        this.fullName = 'Team Magma\'s Claydol MA';
        this.MAGMA_SWITCH_MARKER = 'MAGMA_SWITCH_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            if ((0, prefabs_1.HAS_MARKER)(this.MAGMA_SWITCH_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.ABILITY_USED)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.MAGMA_SWITCH_MARKER, player, this);
            const blockedFrom = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                var _a;
                if (!((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.TEAM_MAGMA))) {
                    blockedFrom.push(target);
                }
            });
            // No blockedMap needed, since all energy cards are allowed to be moved
            store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 1, allowCancel: true, blockedMap: [], blockedFrom }), transfers => {
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
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.MAGMA_SWITCH_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            if (effect.player.hand.cards.length > effect.opponent.hand.cards.length) {
                effect.damage += 20;
            }
        }
        return state;
    }
}
exports.TeamMagmasClaydol = TeamMagmasClaydol;
