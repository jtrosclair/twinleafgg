"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vileplumeex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Vileplumeex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gloom';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = G;
        this.hp = 140;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Block Dust',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as Vileplume ex is your Active Pokémon, your opponent can\'t play any Trainer cards (except for Supporter cards) from his or her hand.'
            }];
        this.attacks = [{
                name: 'Special Formula',
                cost: [G, C, C],
                damage: 50,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep and Poisoned. If tails, the Defending Pokémon is now Confused.'
            }];
        this.set = 'HL';
        this.setNumber = '100';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Vileplume ex';
        this.fullName = 'Vileplume ex HL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayItemEffect || effect instanceof play_card_effects_1.AttachPokemonToolEffect || effect instanceof play_card_effects_1.PlayStadiumEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.active.getPokemonCard() !== this && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            // Checking to see if ability is being blocked
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, opponent, this)) {
                return state;
            }
            if (opponent.active.getPokemonCard() === this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            (0, prefabs_1.COIN_FLIP_PROMPT)(store, state, player, result => {
                if (result) {
                    (0, prefabs_1.ADD_SLEEP_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                    (0, prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                }
                else {
                    (0, prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE)(store, state, opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Vileplumeex = Vileplumeex;
