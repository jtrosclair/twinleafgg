"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delphox = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const energy_card_1 = require("../../game/store/card/energy-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const prefabs_2 = require("../../game/store/prefabs/prefabs");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
class Delphox extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Braixen';
        this.hp = 160;
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Flare Magic',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may discard a Basic [R] Energy from your hand in order to use this Ability. Draw cards until you have 7 cards in your hand.'
            }];
        this.attacks = [{
                name: 'Energy Storm',
                cost: [R, R],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage times the number of Energy attached to all Pokemon in play.'
            }];
        this.regulationMark = 'J';
        this.set = 'M4';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Delphox';
        this.fullName = 'Delphox M4';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if (player.active.getPokemonCard() !== this) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const basicRInHand = player.hand.cards.find(c => c instanceof energy_card_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(R));
            if (!basicRInHand) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            player.hand.moveCardTo(basicRInHand, player.discard);
            const toDraw = Math.max(0, 7 - player.hand.cards.length);
            if (toDraw > 0) {
                (0, prefabs_2.DRAW_CARDS)(player, toDraw);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let totalEnergy = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkEnergy);
                checkEnergy.energyMap.forEach(em => { totalEnergy += em.provides.length; });
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, cardList);
                store.reduceEffect(state, checkEnergy);
                checkEnergy.energyMap.forEach(em => { totalEnergy += em.provides.length; });
            });
            effect.damage = 30 * totalEnergy;
        }
        return state;
    }
}
exports.Delphox = Delphox;
