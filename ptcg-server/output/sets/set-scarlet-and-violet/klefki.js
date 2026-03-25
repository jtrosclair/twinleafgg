"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Klefki = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Klefki extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Mischievous Lock',
                powerType: pokemon_types_1.PowerType.ABILITY,
                abilityLock: true,
                text: 'As long as this Pokémon is in the Active Spot, Basic ' +
                    'Pokémon in play (both yours and your opponent\'s) have no ' +
                    'Abilities, except for Mischievous Lock.'
            }];
        this.attacks = [{
                name: 'Joust',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Before doing damage, discard all Pokémon Tools from your opponent\'s Active Pokémon.'
            }];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Klefki';
        this.fullName = 'Klefki SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Klefki is not active Pokemon
            if (player.active.getPokemonCard() !== this
                && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            // Get the target Pokemon card
            const targetPokemon = effect.target;
            if (!targetPokemon) {
                return state;
            }
            // only remove abilities from Pokemon in play
            const targetCardList = game_1.StateUtils.findCardList(state, targetPokemon);
            if (!(targetCardList instanceof game_1.PokemonCardList)) {
                return state;
            }
            // We are not removing abilities from Non-Basic Pokemon
            if (targetPokemon.stage !== card_types_1.Stage.BASIC) {
                return state;
            }
            // Filter out abilities (except Mischievous Lock) from Basic Pokemon
            effect.powers = effect.powers.filter(power => power.powerType !== pokemon_types_1.PowerType.ABILITY || power.name === 'Mischievous Lock');
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === pokemon_types_1.PowerType.ABILITY && effect.power.name !== 'Mischievous Lock') {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Klefki is not active Pokemon
            if (player.active.getPokemonCard() !== this
                && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            // Mischievous Lock only affects Pokemon in play, not abilities used from discard.
            if (effect.power.useFromDiscard || effect.power.useFromHand) {
                return state;
            }
            // We are not blocking the Abilities from Non-Basic Pokemon
            if (effect.card.stage !== card_types_1.Stage.BASIC) {
                return state;
            }
            // Try reducing ability for each player  
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard active Pokemon's tool first
            const activePokemon = opponent.active;
            if (activePokemon.tools.length > 0) {
                activePokemon.moveCardsTo([...activePokemon.tools], opponent.discard);
            }
            // Then deal damage
            effect.damage = 10;
            return state;
        }
        return state;
    }
}
exports.Klefki = Klefki;
