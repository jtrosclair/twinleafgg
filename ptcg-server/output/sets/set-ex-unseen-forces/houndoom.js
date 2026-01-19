"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Houndoom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const choose_energy_prompt_1 = require("../../game/store/prompts/choose-energy-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Houndoom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Houndour';
        this.cardType = R;
        this.hp = 70;
        this.retreat = [C];
        this.weakness = [{ type: W }];
        this.powers = [{
                name: 'Lonesome',
                powerType: pokemon_types_1.PowerType.POKEBODY,
                text: 'As long as you have less Pokémon in play than your opponent, your opponent can\'t play any Trainer cards (except for Supporter cards) from his or her hand.'
            }];
        this.attacks = [
            {
                name: 'Tight Jaw',
                cost: [C, C],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Flamethrower',
                cost: [R, R, C],
                damage: 70,
                text: 'Discard a [R] Energy attached to Houndoom.'
            }
        ];
        this.set = 'UF';
        this.name = 'Houndoom';
        this.fullName = 'Houndoom UF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof play_card_effects_1.PlayItemEffect || effect instanceof play_card_effects_1.AttachPokemonToolEffect || effect instanceof play_card_effects_1.PlayStadiumEffect) &&
            game_1.StateUtils.isPokemonInPlay(game_1.StateUtils.getOpponent(state, effect.player), this)) {
            const player = game_1.StateUtils.findOwner(state, game_1.StateUtils.findCardList(state, this));
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (effect.player !== opponent) {
                return state;
            }
            if ((0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                return state;
            }
            const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const opponentBench = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            // If owner has less Pokémon, block the trainer card
            if (playerBench < opponentBench) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            return store.prompt(state, new choose_energy_prompt_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.FIRE], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_2.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Houndoom = Houndoom;
