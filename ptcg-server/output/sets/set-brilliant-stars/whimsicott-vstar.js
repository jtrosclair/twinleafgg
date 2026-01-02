"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhimsicottVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class WhimsicottVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VSTAR;
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.evolvesFrom = 'Whimsicott V';
        this.cardType = P;
        this.hp = 250;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Trick Wind',
                cost: [P, C, C],
                damage: 160,
                text: 'During your opponent\'s next turn, they can\'t play any Pokémon Tool or Special Energy cards from their hand.',
            },
            {
                name: 'Fluffball Star',
                cost: [P],
                damage: 0,
                text: 'This attack does 60 damage to 1 of your opponent\'s Pokémon for each Energy attached to this Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 VSTAR Power in a game.)',
            }];
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Whimsicott VSTAR';
        this.fullName = 'Whimsicott VSTAR BRS';
        this.DOMINATING_ECHO_MARKER = 'DOMINATING_ECHO_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Trick Wind
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.DOMINATING_ECHO_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.AttachPokemonToolEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
            const player = effect.player;
            if (player.marker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (effect.player.marker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
                effect.player.marker.removeMarker(this.DOMINATING_ECHO_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.DOMINATING_ECHO_MARKER, this);
                });
            }
        }
        // Fluffball Star
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (player.usedVSTAR) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            player.usedVSTAR = true;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energies = 0;
            checkProvidedEnergyEffect.energyMap.forEach(energy => { energy.provides.forEach(e => { energies++; }); });
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(60 * energies, effect, store, state);
        }
        return state;
    }
}
exports.WhimsicottVSTAR = WhimsicottVSTAR;
