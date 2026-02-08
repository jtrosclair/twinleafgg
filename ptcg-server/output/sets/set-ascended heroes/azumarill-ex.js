"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Azumarillex = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Azumarillex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Marill';
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 270;
        this.weakness = [{ type: M }];
        this.resistance = [];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Bubble Gathering',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'As often as you like during your turn, you may use this Ability. Move an Energy from 1 of your other Pokémon to this Pokémon.'
            }];
        this.attacks = [{
                name: 'Energy Balloon',
                cost: [C, C, C],
                damage: 60,
                damageCalculation: '+',
                text: 'This attack does 40 more damage for each [P] Energy attached to this Pokemon.'
            }];
        this.regulationMark = 'I';
        this.set = 'ASC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Azumarill ex';
        this.fullName = 'Azumarill ex MC';
    }
    reduceEffect(store, state, effect) {
        // Bubble Bundle ability
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY }, { allowCancel: true, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                if (transfers.length > 0) {
                    for (const transfer of transfers) {
                        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        source.moveCardTo(transfer.card, target);
                    }
                }
                (0, prefabs_1.ABILITY_USED)(player, this);
            });
        }
        // Energy Balloon attack
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            let psychicEnergyCount = 0;
            player.active.energies.cards.forEach(card => {
                var _a;
                if (card.superType === game_1.SuperType.ENERGY) {
                    const energyCard = card;
                    if (energyCard.energyType === 'P' || ((_a = energyCard.provides) === null || _a === void 0 ? void 0 : _a.includes('P'))) {
                        psychicEnergyCount++;
                    }
                }
            });
            effect.damage += (40 * psychicEnergyCount);
        }
        return state;
    }
}
exports.Azumarillex = Azumarillex;
