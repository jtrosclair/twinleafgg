"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metagrossex = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Metagrossex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Metang';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = M;
        this.hp = 150;
        this.weakness = [{ type: R }, { type: F }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Magnetic Redraw',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if Metagross ex is your Active Pokémon, you may use this power. Each player shuffles his or her hand into his or her deck. Then, each player draws 4 cards. This power can\'t be used if Metagross ex is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Scanblast',
                cost: [M, M, C],
                damage: 70,
                text: 'Does 70 damage to each of your opponent\'s Benched Pokémon that has the same name as the Defending Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'PK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Metagross ex';
        this.fullName = 'Metagross ex PK';
        this.MAGNETIC_REDRAW_MARKER = 'MAGNETIC_REDRAW_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.active.getPokemonCard() !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if ((0, prefabs_1.HAS_MARKER)(this.MAGNETIC_REDRAW_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            (0, prefabs_1.ADD_MARKER)(this.MAGNETIC_REDRAW_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            player.hand.moveTo(player.deck);
            opponent.hand.moveTo(opponent.deck);
            (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            (0, prefabs_1.SHUFFLE_DECK)(store, state, opponent);
            player.deck.moveTo(player.hand, 4);
            opponent.deck.moveTo(opponent.hand, 4);
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.MAGNETIC_REDRAW_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                var _a, _b;
                if (cardList === effect.opponent.active) {
                    return;
                }
                if (((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === ((_b = effect.opponent.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.name)) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 70);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Metagrossex = Metagrossex;
