"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Armaldo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Armaldo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Anorith';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Primal Veil',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as Armaldo is your Active Pokémon, each player can\'t play any Supporter Cards.'
            }];
        this.attacks = [{
                name: 'Blade Arms',
                cost: [F, F, C],
                damage: 60,
                text: ''
            }];
        this.set = 'SS';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Armaldo';
        this.fullName = 'Armaldo SS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlaySupporterEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.active.getPokemonCard() !== this && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            const armaldoOwner = player.active.getPokemonCard() === this ? player : opponent;
            if (!prefabs_1.IS_POKEBODY_BLOCKED(store, state, armaldoOwner, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
        }
        return state;
    }
}
exports.Armaldo = Armaldo;
