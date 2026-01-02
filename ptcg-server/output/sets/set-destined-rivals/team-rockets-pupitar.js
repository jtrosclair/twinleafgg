"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsPupitar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useExplosiveAwakening(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_2, evolvesFrom: 'Team Rocket\'s Pupitar' }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        // Evolve Pokemon
        player.deck.moveCardsTo(cards, player.active);
        player.active.clearEffects();
        player.active.pokemonPlayedTurn = state.turn;
    }
    prefabs_1.SHUFFLE_DECK(store, state, player);
}
class TeamRocketsPupitar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Rocket\'s Larvitar';
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = F;
        this.hp = 100;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Explosive Awakening',
                cost: [C],
                damage: 30,
                text: 'Search your deck for a card that evolves from this Pokémon and put it onto this Pokémon to evolve it. Then, shuffle your deck.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'DRI';
        this.setNumber = '95';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Pupitar';
        this.fullName = 'Team Rocket\'s Pupitar DRI';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const generator = useExplosiveAwakening(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.TeamRocketsPupitar = TeamRocketsPupitar;
