"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsArbok = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class TeamRocketsArbok extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Rocket\'s Ekans';
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = D;
        this.hp = 130;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Intimidating Glare',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokemon is your Active Pokemon, your opponent can\'t play any Pokemon cards with Abilities from their hand (excluding Rocket\'s Pokemon).'
            }];
        this.attacks = [
            {
                name: 'Spinning Tail',
                cost: [D, D, D],
                damage: 0,
                text: 'This attack does 30 damage to each of your opponent\'s Pokemon (Don\'t apply Weakness and Resistance for Benched Pokemon).'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '113';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Arbok';
        this.fullName = 'Team Rocket\'s Arbok DRI';
    }
    reduceEffect(store, state, effect) {
        // Intimidating Glare
        if (effect instanceof play_card_effects_1.PlayPokemonEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = effect.pokemonCard;
            if (opponent.active.getPokemonCard() !== this) {
                return state;
            }
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, opponent, this)) {
                return state;
            }
            const powersEffect = new check_effects_1.CheckPokemonPowersEffect(player, effect.pokemonCard);
            state = store.reduceEffect(state, powersEffect);
            if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.ABILITY) && !pokemonCard.tags.includes(card_types_1.CardTag.TEAM_ROCKET)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        // Spinning Tail
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                (0, prefabs_1.DAMAGE_OPPONENT_POKEMON)(store, state, effect, 30, [cardList]);
            });
        }
        return state;
    }
}
exports.TeamRocketsArbok = TeamRocketsArbok;
