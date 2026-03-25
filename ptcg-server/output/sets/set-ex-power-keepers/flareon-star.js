"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlareonStar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class FlareonStar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = R;
        this.hp = 70;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Crimson Ray',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Flareon Star from your hand onto your Bench, you may use this power. Each Active Pokémon (both yours and your opponent\'s) is now Burned.'
            }];
        this.attacks = [
            {
                name: 'Flamethrower',
                cost: [R, R, C],
                damage: 50,
                text: 'Discard a [R] Energy attached to Flareon Star.'
            }
        ];
        this.set = 'PK';
        this.name = 'Flareon Star';
        this.fullName = 'Flareon Star PK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && !(0, prefabs_1.IS_POKEPOWER_BLOCKED)(store, state, effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            (0, prefabs_1.CONFIRMATION_PROMPT)(store, state, player, result => {
                if (!result) {
                    return state;
                }
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
                (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, player, this);
                (0, prefabs_1.ADD_BURN_TO_PLAYER_ACTIVE)(store, state, opponent, this);
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.FIRE], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.FlareonStar = FlareonStar;
