"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PorygonZ = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const plasma_energy_1 = require("../set-plasma-storm/plasma-energy");
class PorygonZ extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TEAM_PLASMA];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Porygon2';
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Plasma Transfer',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn (before your attack), you may move a Plasma Energy attached to 1 of your Pokémon to another of your Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Tri Attack',
                cost: [C, C, C],
                damage: 50,
                damageCalculation: 'x',
                text: 'Flip 3 coins. This attack does 50 damage times the number of heads.'
            }
        ];
        this.set = 'PLB';
        this.setNumber = '74';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Porygon-Z';
        this.fullName = 'Porygon-Z PLB';
    }
    reduceEffect(store, state, effect) {
        // Ability: Plasma Transfer - move Plasma Energy between your Pokemon
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            // Build blocked map - only allow moving Plasma Energy cards
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const blocked = [];
                cardList.cards.forEach((c, index) => {
                    if (!(c instanceof plasma_energy_1.PlasmaEnergy)) {
                        blocked.push(index);
                    }
                });
                if (blocked.length !== cardList.cards.length) {
                    blockedMap.push({ source: target, blocked });
                }
            });
            return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], {}, { allowCancel: true, blockedMap }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    if (transfer.from.player === transfer.to.player
                        && transfer.from.slot === transfer.to.slot
                        && transfer.from.index === transfer.to.index) {
                        continue;
                    }
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
            });
        }
        // Attack: Tri Attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT)(store, state, player, 3, results => {
                const heads = results.filter(r => r).length;
                effect.damage = 50 * heads;
            });
        }
        return state;
    }
}
exports.PorygonZ = PorygonZ;
