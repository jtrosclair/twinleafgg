"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tynamo2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Tynamo2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Generate Electricity',
                cost: [L],
                damage: 0,
                text: 'Search your deck for a [L] Energy card and attach it to this Pokémon. Then, shuffle your deck.'
            }
        ];
        this.set = 'UNM';
        this.setNumber = '64';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Tynamo';
        this.fullName = 'Tynamo UNM 64';
    }
    reduceEffect(store, state, effect) {
        // Attack 1: Generate Electricity
        // Ref: set-unbroken-bonds/kyurem.ts (Call Forth Cold - search deck for energy and attach)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            state = (0, prefabs_1.ATTACH_ENERGY_PROMPT)(store, state, player, game_1.PlayerType.BOTTOM_PLAYER, game_1.SlotType.DECK, [game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { min: 1, max: 1, allowCancel: true });
        }
        return state;
    }
}
exports.Tynamo2 = Tynamo2;
