"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ampharos = void 0;
const game_1 = require("../../game");
const game_2 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ampharos extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Flaaffy';
        this.cardType = L;
        this.hp = 150;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Unseen Flash',
                useWhenInPlay: true,
                powerType: game_2.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may put 2 [L] Energy cards from your hand in the Lost Zone. If you do, your opponent\'s Active Pokémon is now Paralyzed.'
            }];
        this.attacks = [{
                name: 'Split Bomb',
                cost: [L, L],
                damage: 0,
                text: 'This attack does 50 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'LOT';
        this.setNumber = '78';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ampharos';
        this.fullName = 'Ampharos LOT';
        this.UNSEEN_FLASH_MARKER = 'UNSEEN_FLASH_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const lightningEnergyCount = player.hand.cards.filter(c => {
                return c instanceof game_1.EnergyCard && c.name === 'Lightning Energy';
            }).length;
            if (lightningEnergyCount < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if ((0, prefabs_1.HAS_MARKER)(this.UNSEEN_FLASH_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: game_1.SuperType.ENERGY, name: 'Lightning Energy' }, { allowCancel: true, min: 2, max: 2 }), cards => {
                cards = cards || [];
                (0, prefabs_1.ADD_PARALYZED_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                (0, prefabs_1.ADD_MARKER)(this.UNSEEN_FLASH_MARKER, player, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
                player.hand.moveCardsTo(cards, player.lostzone);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, prefabs_1.THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON)(50, effect, store, state, 2, 2, false, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE]);
        }
        return state;
    }
}
exports.Ampharos = Ampharos;
