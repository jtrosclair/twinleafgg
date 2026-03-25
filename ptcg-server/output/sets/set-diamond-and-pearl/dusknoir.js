"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dusknoir = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Dusknoir extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dusclops';
        this.cardType = P;
        this.hp = 120;
        this.weakness = [{ type: D, value: +30 }];
        this.resistance = [{ type: C, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Dark Palm',
                powerType: __1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if your opponent has 4 or more Benched Pokémon, you may choose 1 of them and shuffle that Pokémon and all cards attached to it into his or her deck. This power can\'t be used if Dusknoir is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Hard Feelings',
                cost: [P, P, C],
                damage: 0,
                text: 'Put 5 damage counters on the Defending Pokémon. Then, count the number of Prize cards your opponent has taken and put that many damage counters on the Defending Pokémon.'
            }];
        this.set = 'DP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Dusknoir';
        this.fullName = 'Dusknoir DP';
        this.DARK_PALM_MARKER = 'DARK_PALM_MARKER';
    }
    reduceEffect(store, state, effect) {
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.DARK_PALM_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.filter(b => b.cards.length > 0).length >= 4;
            if (!hasBench) {
                throw new __1.GameError(__1.GameMessage.CANNOT_USE_POWER);
            }
            if ((0, prefabs_1.HAS_MARKER)(this.DARK_PALM_MARKER, player, this)) {
                throw new __1.GameError(__1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.DARK_PALM_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            return store.prompt(state, new __1.ChoosePokemonPrompt(player.id, __1.GameMessage.CHOOSE_POKEMON_TO_SHUFFLE, __1.PlayerType.TOP_PLAYER, [__1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    target.clearEffects();
                    target.damage = 0;
                    target.moveTo(opponent.deck);
                    return store.prompt(state, new __1.ShuffleDeckPrompt(opponent.id), order => {
                        opponent.deck.applyOrder(order);
                    });
                });
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            (0, attack_effects_1.PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON)((5 + effect.opponent.prizesTaken), store, state, effect);
        }
        return state;
    }
}
exports.Dusknoir = Dusknoir;
