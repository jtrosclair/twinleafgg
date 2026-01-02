"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pignite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_2 = require("../../game");
class Pignite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Tepig';
        this.cardType = R;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Flame Charge',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a [R] Energy card and attach it to this Pokémon. Shuffle your deck afterward.'
            },
            {
                name: 'Heat Crash',
                cost: [R, R, C],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'BLW';
        this.name = 'Pignite';
        this.fullName = 'Pignite BLW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (!cardList)
                return state;
            state = prefabs_1.ATTACH_ENERGY_PROMPT(store, state, player, game_2.PlayerType.BOTTOM_PLAYER, game_2.SlotType.DECK, [game_2.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 1, max: 1, allowCancel: true });
            return prefabs_1.SHUFFLE_DECK(store, state, player);
        }
        return state;
    }
}
exports.Pignite = Pignite;
