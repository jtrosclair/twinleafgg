"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ribombee = void 0;
const game_1 = require("../../game");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Ribombee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cutiefly';
        this.cardType = Y;
        this.hp = 60;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.powers = [{
                name: 'Mysterious Buzz',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is on your Bench, whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to your [Y] Pokémon in play.'
            }];
        this.attacks = [{
                name: 'Stampede',
                cost: [Y],
                damage: 20,
                text: ''
            }];
        this.set = 'LOT';
        this.name = 'Ribombee';
        this.fullName = 'Ribombee LOT';
        this.setNumber = '146';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof play_card_effects_1.TrainerTargetEffect && effect.target && ((_a = effect.trainerCard) === null || _a === void 0 ? void 0 : _a.trainerType) === game_1.TrainerType.SUPPORTER) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isRibombeeInPlay = false;
            opponent.bench.forEach(benchPokemon => {
                if (benchPokemon.getPokemonCard() === this) {
                    isRibombeeInPlay = true;
                }
            });
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (isRibombeeInPlay && checkPokemonType.cardTypes.includes(game_1.CardType.FAIRY)) {
                effect.target = undefined;
            }
        }
        return state;
    }
}
exports.Ribombee = Ribombee;
