"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bronzong = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Bronzong extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bronzor';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: P, value: +20 }];
        this.resistance = [{ type: R, value: -20 }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Pain Amplifier',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Bronzong is your Active Pokémon, put 1 damage counter on each of your opponent\'s Pokémon that has any Poké-Powers between turns.'
            }];
        this.attacks = [{
                name: 'Pain Amplifier',
                cost: [],
                damage: 0,
                text: 'Put 1 damage counter on each of your opponent\'s Pokémon that already has damage counters on it.'
            },
            {
                name: 'Coating',
                cost: [P, C, C],
                damage: 60,
                text: 'During your opponent\'s next turn, any damage done to Bronzong by attacks is reduced by 20 (after applying Weakness and Resistance).'
            }];
        this.set = 'MD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Bronzong';
        this.fullName = 'Bronzong MD';
        this.COATING_MARKER = 'COATING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                const pokemon = cardList.getPokemonCard();
                if (pokemon && pokemon.powers.some(p => p.powerType === game_1.PowerType.POKEPOWER)) {
                    cardList.damage += 10;
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList.damage === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutCountersEffect(effect, 10);
                damageEffect.target = cardList;
                store.reduceEffect(state, damageEffect);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            (0, prefabs_1.ADD_MARKER)(this.COATING_MARKER, effect.player, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && (0, prefabs_1.HAS_MARKER)(this.COATING_MARKER, game_1.StateUtils.getOpponent(state, effect.player), this)
            && effect.target.getPokemonCard() === this) {
            if (state.phase !== game_1.GamePhase.ATTACK) {
                return state;
            }
            effect.damage -= 20;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player !== game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this))) {
            (0, prefabs_1.REMOVE_MARKER)(this.COATING_MARKER, game_1.StateUtils.getOpponent(state, effect.player), this);
        }
        return state;
    }
}
exports.Bronzong = Bronzong;
