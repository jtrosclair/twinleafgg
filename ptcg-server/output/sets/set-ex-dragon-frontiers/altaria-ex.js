"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Altariaex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Altariaex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Swablu';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = W;
        this.hp = 100;
        this.weakness = [{ type: C }];
        this.resistance = [{ type: G, value: -30 }, { type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Extra Boost',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may attach a basic Energy card from your hand to 1 of your Stage 2 Pokémon-ex. This power can\'t be used if Altaria ex is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Healing Light',
                cost: [W, C, C],
                damage: 60,
                text: 'Remove 1 damage counter from each of your Pokémon.'
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '90';
        this.name = 'Altaria ex';
        this.fullName = 'Altaria ex DF';
        this.EXTRA_BOOST_MARKER = 'EXTRA_BOOST_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            (0, prefabs_1.REMOVE_MARKER)(this.EXTRA_BOOST_MARKER, player, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            if ((0, prefabs_1.HAS_MARKER)(this.EXTRA_BOOST_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            if (!player.hand.cards.some(card => card.superType === card_types_1.SuperType.ENERGY && card.energyType === card_types_1.EnergyType.BASIC)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let hasStage2Ex = false;
            const blockedTo = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                var _a;
                // Block if not Stage 2 or doesn't have POKEMON_ex tag
                if (card.stage !== card_types_1.Stage.STAGE_2 && !((_a = card.tags) === null || _a === void 0 ? void 0 : _a.includes(card_types_1.CardTag.POKEMON_ex))) {
                    blockedTo.push(target);
                }
                else {
                    hasStage2Ex = true;
                }
            });
            if (!hasStage2Ex) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true, min: 1, max: 1, blockedTo }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    (0, prefabs_1.ADD_MARKER)(this.EXTRA_BOOST_MARKER, player, this);
                    (0, prefabs_1.ABILITY_USED)(player, this);
                    //Attaching energy
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    (0, prefabs_1.MOVE_CARD_TO)(state, transfer.card, target);
                }
            });
        }
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.EXTRA_BOOST_MARKER, this);
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(effect.player, cardList, 10);
                state = store.reduceEffect(state, healEffect);
            });
        }
        return state;
    }
}
exports.Altariaex = Altariaex;
