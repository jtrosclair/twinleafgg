"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AurasLucario2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class AurasLucario2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.AURAS];
        this.cardType = M;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Intimidation Wave',
                cost: [M],
                damage: 10,
                text: 'If the Defending Pokémon is a Basic Pokémon, choose 1 of the Defending Pokémon\'s attacks.That Pokémon can\'t use that attack during your opponent\'s next turn.'
            },
            {
                name: 'Bite',
                cost: [C, C, C],
                damage: 30,
                text: ''
            }];
        this.set = 'PCGP';
        this.name = 'Aura\'s Lucario';
        this.fullName = 'Aura\'s Lucario PCGP 90';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard === undefined || pokemonCard.attacks.length === 0 || pokemonCard.stage !== card_types_1.Stage.BASIC) {
                return state;
            }
            store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_DISABLE, [pokemonCard], { allowCancel: false }), result => {
                result;
                if (!result) {
                    return state;
                }
                this.DISABLED_ATTACK = result;
                store.log(state, game_1.GameLog.LOG_PLAYER_DISABLES_ATTACK, {
                    name: player.name,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    attack: this.DISABLED_ATTACK.name
                });
                opponent.active.marker.addMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
                return state;
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            if (effect.attack === this.DISABLED_ATTACK) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this)) {
            effect.player.marker.removeMarker(game_1.PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER, this);
            this.DISABLED_ATTACK = undefined;
        }
        return state;
    }
}
exports.AurasLucario2 = AurasLucario2;
