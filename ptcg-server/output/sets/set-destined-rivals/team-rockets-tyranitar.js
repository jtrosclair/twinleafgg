"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsTyranitar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class TeamRocketsTyranitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Team Rocket\'s Pupitar';
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = F;
        this.hp = 180;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Sand Stream',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, put 2 damage counter on each of your opponent\'s Basic Pokémon during Pokémon Checkup.'
            }];
        this.attacks = [
            {
                name: 'Breakthrough Tackle',
                cost: [F, C, C, C],
                damage: 180,
                text: 'Discard an Energy from your opponent\'s Active Pokémon.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '96';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Tyranitar';
        this.fullName = 'Team Rocket\'s Tyranitar DRI';
    }
    reduceEffect(store, state, effect) {
        // Sand Stream
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if ((0, prefabs_1.IS_ABILITY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            if (player.active.getPokemonCard() !== this) {
                return state;
            }
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.stage === card_types_1.Stage.BASIC) {
                    cardList.damage += 20;
                }
            });
            return state;
        }
        // Breakthrough Tackle
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const opponent = effect.opponent;
            if (!opponent.active.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                return state;
            }
            let card;
            return store.prompt(state, new game_1.ChooseCardsPrompt(effect.player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                card = selected[0];
                return store.reduceEffect(state, new attack_effects_1.DiscardCardsEffect(effect, [card]));
            });
        }
        return state;
    }
}
exports.TeamRocketsTyranitar = TeamRocketsTyranitar;
