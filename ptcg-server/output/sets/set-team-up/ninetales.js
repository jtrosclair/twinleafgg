"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ninetales = void 0;
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ninetales extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Vulpix';
        this.cardType = R;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Nine Temptations',
                useWhenInPlay: true,
                powerType: game_2.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may discard 2 [R] Energy cards from your hand. If you do, switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Flame Tail',
                cost: [R, C, C],
                damage: 90,
                text: ''
            },
        ];
        this.set = 'TEU';
        this.setNumber = '16';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Ninetales';
        this.fullName = 'Ninetales TEU';
        this.NINE_TEMPTATIONS_MARKER = 'NINE_TEMPTATIONS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const fireEnergyCount = player.hand.cards.filter(c => {
                return c instanceof game_1.EnergyCard && c.name === 'Fire Energy';
            }).length;
            if (fireEnergyCount < 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if ((0, prefabs_1.HAS_MARKER)(this.NINE_TEMPTATIONS_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: game_1.SuperType.ENERGY, name: 'Fire Energy' }, { allowCancel: true, min: 2, max: 2 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return state;
                }
                const hasBench = opponent.bench.some(b => b.cards.length > 0);
                if (!hasBench) {
                    return state;
                }
                store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                    const cardList = result[0];
                    const gustEffect = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, cardList);
                    store.reduceEffect(state, gustEffect);
                    if (gustEffect.target) {
                        opponent.switchPokemon(gustEffect.target);
                    }
                });
                (0, prefabs_1.ADD_MARKER)(this.NINE_TEMPTATIONS_MARKER, player, this);
                (0, prefabs_1.ABILITY_USED)(player, this);
                player.hand.moveCardsTo(cards, player.discard);
            });
        }
        return state;
    }
}
exports.Ninetales = Ninetales;
