"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon2 = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Porygon2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Porygon';
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Backup',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if you have less than 6 cards in your hand, you may draw cards until you have 6 cards in your hand. This power can\'t be used if Porygon2 is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Machine Burst',
                cost: [C, C],
                damage: 30,
                text: 'If Porygon2 has a Technical Machine card attached to it, the Defending Pokémon is now Asleep and Burned.'
            }];
        this.set = 'DS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.name = 'Porygon2';
        this.fullName = 'Porygon2 DS';
        this.BACKUP_MARKER = 'BACKUP_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.BACKUP_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            //Once per turn
            if (prefabs_1.HAS_MARKER(this.BACKUP_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
            prefabs_1.DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 6);
            prefabs_1.ADD_MARKER(this.BACKUP_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
        }
        if (prefabs_1.AFTER_ATTACK(effect, 0, this)) {
            const player = effect.player;
            if (player.active.cards.some(c => c.superType === card_types_1.SuperType.TRAINER && c.tags.includes(card_types_1.CardTag.TECHNICAL_MACHINE))) {
                prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
                prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
            }
        }
        return state;
    }
}
exports.Porygon2 = Porygon2;
