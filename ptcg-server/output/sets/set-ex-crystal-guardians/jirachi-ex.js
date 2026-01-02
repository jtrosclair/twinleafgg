"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jirachiex = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Jirachiex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = P;
        this.hp = 90;
        this.retreat = [C];
        this.powers = [{
                name: 'Star Light',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as your opponent has any Pokémon-ex or Stage 2 Evolved Pokémon in play, Jirachi ex pays [C] less Energy to use Shield Beam or Super Psy Bolt.',
            }];
        this.attacks = [{
                name: 'Shield Beam',
                cost: [P, C],
                damage: 30,
                text: 'During your opponent\'s next turn, your opponent can\'t use any Poké-Powers on his or her Pokémon.'
            },
            {
                name: 'Super Psy Bolt',
                cost: [P, C, C],
                damage: 50,
                text: ''
            }];
        this.set = 'CG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '94';
        this.name = 'Jirachi ex';
        this.fullName = 'Jirachi ex CG';
        this.SHIELD_BEAM_MARKER = 'SHIELD_BEAM_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === (this.attacks[0] || this.attacks[1])) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_POKEBODY_BLOCKED(store, state, player, this)) {
                return state;
            }
            let isThingInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card.stage === card_types_1.Stage.STAGE_2 || card.tags.includes(card_types_1.CardTag.POKEMON_ex)) {
                    isThingInPlay = true;
                }
            });
            if (!isThingInPlay) {
                return state;
            }
            const costToRemove = 1;
            for (let i = 0; i < costToRemove; i++) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index !== -1) {
                    effect.cost.splice(index, 1);
                }
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.ADD_MARKER(this.SHIELD_BEAM_MARKER, opponent, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && prefabs_1.HAS_MARKER(this.SHIELD_BEAM_MARKER, effect.player, this)
            && (effect.power.powerType === game_1.PowerType.POKEPOWER)) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.SHIELD_BEAM_MARKER, this);
        return state;
    }
}
exports.Jirachiex = Jirachiex;
