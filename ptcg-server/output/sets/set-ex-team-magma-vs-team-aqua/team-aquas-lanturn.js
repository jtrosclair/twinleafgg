"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamAquasLanturn = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamAquasLanturn extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Team Aqua\'s Chinchou';
        this.tags = [card_types_1.CardTag.TEAM_AQUA];
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Auxiliary Light',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may attach a basic Energy card from your hand to Team Aqua\'s Lanturn. Put 2 damage counters on Team Aqua\'s Lanturn. This power can\'t be used if Team Aqua\'s Lanturn is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Lightning Ball',
                cost: [L, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'MA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.name = 'Team Aqua\'s Lanturn';
        this.fullName = 'Team Aqua\'s Lanturn MA';
        this.AUXILIARY_LIGHT_MARKER = 'AUXILIARY_LIGHT_MARKER';
    }
    reduceEffect(store, state, effect) {
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.AUXILIARY_LIGHT_MARKER, this);
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            //Once per turn
            if ((0, prefabs_1.HAS_MARKER)(this.AUXILIARY_LIGHT_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            //Must have basic energy in discard
            if (!player.hand.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 1, allowCancel: false }), selected => {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        (0, prefabs_1.MOVE_CARDS)(store, state, player.hand, cardList, { cards: selected });
                        cardList.damage += 20;
                    }
                });
                (0, prefabs_1.ADD_MARKER)(this.AUXILIARY_LIGHT_MARKER, player, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
            });
        }
        return state;
    }
}
exports.TeamAquasLanturn = TeamAquasLanturn;
