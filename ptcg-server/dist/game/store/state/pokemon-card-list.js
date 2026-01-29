"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonCardList = void 0;
const card_types_1 = require("../card/card-types");
const pokemon_card_1 = require("../card/pokemon-card");
const card_list_1 = require("./card-list");
const card_marker_1 = require("./card-marker");
const state_utils_1 = require("../state-utils");
class PokemonCardList extends card_list_1.CardList {
    constructor() {
        super(...arguments);
        this.damage = 0;
        this.hp = 0;
        this.specialConditions = [];
        this.poisonDamage = 10;
        this.burnDamage = 20;
        this.marker = new card_marker_1.Marker();
        this.pokemonPlayedTurn = 0;
        this.sleepFlips = 1;
        this.boardEffect = [];
        this.hpBonus = 0;
        this.tools = [];
        this.energies = new card_list_1.CardList();
        this.isActivatingCard = false;
        this.showAllStageAbilities = false;
        this.triggerEvolutionAnimation = false;
        this.showBasicAnimation = false;
        this.triggerAttackAnimation = false;
        this.damageReductionNextTurn = 0;
        this.cannotAttackNextTurn = false;
        this.cannotAttackNextTurnPending = false;
        this.cannotUseAttacksNextTurn = [];
        this.cannotUseAttacksNextTurnPending = [];
        this.maxHpBeforeAttack = 0;
    }
    getPokemons() {
        const result = [];
        for (const card of this.cards) {
            if (card.superType === card_types_1.SuperType.POKEMON && !this.tools.includes(card) && !this.energies.cards.includes(card)) {
                result.push(card);
            }
            else if (card.name === 'Lillie\'s Poké Doll') {
                result.push(card);
            }
            else if (card.name === 'Clefairy Doll') {
                result.push(card);
            }
            else if (card.name === 'Rare Fossil') {
                result.push(card);
            }
            else if (card.name === 'Robo Substitute') {
                result.push(card);
            }
            else if (card.name === 'Mysterious Fossil') {
                result.push(card);
            }
            else if (card.name === 'Unidentified Fossil') {
                result.push(card);
            }
            else if (card.name === 'Antique Plume Fossil') {
                result.push(card);
            }
            else if (card.name === 'Antique Cover Fossil') {
                result.push(card);
            }
            else if (card.name === 'Claw Fossil') {
                result.push(card);
            }
        }
        return result;
    }
    getPokemonCard() {
        const pokemons = this.getPokemons();
        if (pokemons.length > 0) {
            return pokemons[pokemons.length - 1];
        }
    }
    isStage(stage) {
        const pokemonCard = this.getPokemonCard();
        if (pokemonCard === undefined) {
            return false;
        }
        return pokemonCard.stage === stage;
    }
    isEvolved() {
        const pokemons = this.getPokemons();
        const pokemonCard = this.getPokemonCard();
        // Single Pokémon (not evolved)
        if (pokemons.length === 1) {
            return false;
        }
        // LEGEND cards are not considered evolved
        if ((pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.stage) === card_types_1.Stage.LEGEND) {
            return false;
        }
        // VUNION cards are not considered evolved
        if ((pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.stage) === card_types_1.Stage.VUNION) {
            return false;
        }
        // LV_X placed on a Basic Pokémon is not considered evolved
        if ((pokemonCard === null || pokemonCard === void 0 ? void 0 : pokemonCard.stage) === card_types_1.Stage.LV_X && pokemons.length === 2 && pokemons.some(p => p.stage === card_types_1.Stage.BASIC)) {
            return false;
        }
        // Otherwise, it's evolved
        return true;
    }
    clearAttackEffects() {
        this.marker.markers = [];
    }
    clearEffects() {
        this.marker.removeMarker(PokemonCardList.ATTACK_USED_MARKER);
        this.marker.removeMarker(PokemonCardList.ATTACK_USED_2_MARKER);
        this.marker.removeMarker(PokemonCardList.CLEAR_KNOCKOUT_MARKER);
        this.marker.removeMarker(PokemonCardList.NEXT_TURN_MORE_DAMAGE_MARKER);
        this.marker.removeMarker(PokemonCardList.NEXT_TURN_MORE_DAMAGE_MARKER_2);
        this.marker.removeMarker(PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER);
        this.marker.removeMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER);
        this.marker.removeMarker(PokemonCardList.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
        this.marker.removeMarker(PokemonCardList.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
        this.marker.removeMarker(PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
        this.marker.removeMarker(PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
        this.marker.removeMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER);
        this.marker.removeMarker(PokemonCardList.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
        this.marker.removeMarker(PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
        this.marker.removeMarker(PokemonCardList.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
        this.marker.removeMarker(PokemonCardList.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
        this.marker.removeMarker(PokemonCardList.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER);
        this.marker.removeMarker(PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN);
        this.marker.removeMarker(PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN);
        this.marker.removeMarker(PokemonCardList.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER);
        this.marker.removeMarker(PokemonCardList.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);
        this.marker.removeMarker(PokemonCardList.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);
        this.marker.markers = [];
        this.triggerEvolutionAnimation = false;
        this.showBasicAnimation = false;
        this.triggerAttackAnimation = false;
        this.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
        this.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
        this.poisonDamage = 10;
        this.burnDamage = 20;
        this.damageReductionNextTurn = 0;
        this.cannotAttackNextTurn = false;
        this.cannotAttackNextTurnPending = false;
        this.cannotUseAttacksNextTurn = [];
        this.cannotUseAttacksNextTurnPending = [];
        // if (this.cards.length === 0) {
        //   this.damage = 0;
        // }
        // if (this.tool && !this.cards.includes(this.tool)) {
        //   this.tool = undefined;
        // }
    }
    clearAllSpecialConditions() {
        this.removeSpecialCondition(card_types_1.SpecialCondition.POISONED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
        this.removeSpecialCondition(card_types_1.SpecialCondition.BURNED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        this.removeSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
    }
    removeSpecialCondition(sp) {
        if (!this.specialConditions.includes(sp)) {
            return;
        }
        this.specialConditions = this.specialConditions
            .filter(s => s !== sp);
    }
    addSpecialCondition(sp) {
        if (sp === card_types_1.SpecialCondition.POISONED) {
            this.poisonDamage = 10;
        }
        if (sp === card_types_1.SpecialCondition.BURNED) {
            this.burnDamage = 20;
        }
        if (this.specialConditions.includes(sp)) {
            return;
        }
        if (sp === card_types_1.SpecialCondition.POISONED || sp === card_types_1.SpecialCondition.BURNED) {
            this.specialConditions.push(sp);
            return;
        }
        this.specialConditions = this.specialConditions.filter(s => [
            card_types_1.SpecialCondition.PARALYZED,
            card_types_1.SpecialCondition.CONFUSED,
            card_types_1.SpecialCondition.ASLEEP,
            card_types_1.SpecialCondition.ABILITY_USED,
        ].includes(s) === false);
        this.specialConditions.push(sp);
    }
    removeBoardEffect(sp) {
        if (!this.boardEffect.includes(sp)) {
            return;
        }
        this.boardEffect = this.boardEffect
            .filter(s => s !== sp);
    }
    addBoardEffect(sp) {
        if (this.boardEffect.includes(sp)) {
            return;
        }
        this.boardEffect = this.boardEffect.filter(s => [
            card_types_1.BoardEffect.ABILITY_USED,
            card_types_1.BoardEffect.POWER_GLOW,
            card_types_1.BoardEffect.POWER_NEGATED_GLOW,
            card_types_1.BoardEffect.POWER_RETURN,
        ].includes(s) === false);
        this.boardEffect.push(sp);
    }
    //Rule-Box Pokemon
    hasRuleBox() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.POKEMON_ex) || c.tags.includes(card_types_1.CardTag.RADIANT) || c.tags.includes(card_types_1.CardTag.POKEMON_V) || c.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || c.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) || c.tags.includes(card_types_1.CardTag.POKEMON_GX) || c.tags.includes(card_types_1.CardTag.PRISM_STAR) || c.tags.includes(card_types_1.CardTag.BREAK) || c.tags.includes(card_types_1.CardTag.POKEMON_SV_MEGA));
    }
    vPokemon() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.POKEMON_V) || c.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || c.tags.includes(card_types_1.CardTag.POKEMON_VSTAR) || c.tags.includes(card_types_1.CardTag.POKEMON_VUNION));
    }
    exPokemon() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.POKEMON_ex));
    }
    isTera() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.POKEMON_TERA));
    }
    //Single/Rapid/Fusion Strike
    singleStrikePokemon() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.SINGLE_STRIKE));
    }
    rapidStrikePokemon() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.RAPID_STRIKE));
    }
    fusionStrikePokemon() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.FUSION_STRIKE));
    }
    //Future/Ancient
    futurePokemon() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.FUTURE));
    }
    ancientPokemon() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.ANCIENT));
    }
    //Trainer Pokemon
    isLillies() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.LILLIES));
    }
    isNs() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.NS));
    }
    isIonos() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.IONOS));
    }
    isHops() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.HOPS));
    }
    isEthans() {
        return this.cards.some(c => c.tags.includes(card_types_1.CardTag.ETHANS));
    }
    getToolEffect() {
        if (this.tools.length === 0) {
            return;
        }
        const toolCard = this.tools[0];
        if (toolCard instanceof pokemon_card_1.PokemonCard) {
            return toolCard.powers[0] || toolCard.attacks[0];
        }
        // removeTool(tool: Card): void {
        //   const index = this.tools.indexOf(tool);
        //   if (index >= 0) {
        //     delete this.tools[index];
        //   }
        //   this.tools = this.tools.filter(c => c instanceof Card);
        // }
    }
    isPlayerActive(state) {
        const player = state.players[state.activePlayer];
        return player.active === this;
    }
    isOpponentActive(state) {
        const opponent = state_utils_1.StateUtils.getOpponent(state, state.players[state.activePlayer]);
        return opponent.active === this;
    }
    isPlayerBench(state) {
        const player = state.players[state.activePlayer];
        return player.bench.includes(this);
    }
    isOpponentBench(state) {
        const opponent = state_utils_1.StateUtils.getOpponent(state, state.players[state.activePlayer]);
        return opponent.bench.includes(this);
    }
    // Override the parent CardList's moveTo method to properly handle Pokemon acting as energy
    moveTo(destination, count) {
        // Move energies CardList to destination before moving cards
        if (this.energies.cards.length > 0) {
            this.energies.moveTo(destination);
        }
        super.moveTo(destination, count);
    }
    moveCardsTo(cards, destination) {
        for (let i = 0; i < cards.length; i++) {
            let index = this.cards.indexOf(cards[i]);
            if (index !== -1) {
                const card = this.cards.splice(index, 1);
                // Remove the card from energies if it's there
                const energyIndex = this.energies.cards.indexOf(card[0]);
                if (energyIndex !== -1) {
                    this.energies.cards.splice(energyIndex, 1);
                }
                destination.cards.push(card[0]);
                // If destination is a PokemonCardList and card is an energy card (not a Pokemon), add to energies.cards
                if (destination instanceof PokemonCardList) {
                    // Only add actual energy cards (superType === ENERGY), not Pokemon cards that can act as energy
                    const isEnergyCard = card[0].superType === card_types_1.SuperType.ENERGY;
                    if (isEnergyCard && !destination.energies.cards.includes(card[0])) {
                        destination.energies.cards.push(card[0]);
                    }
                }
            }
            else {
                // If not found in cards, check energies
                index = this.energies.cards.indexOf(cards[i]);
                if (index !== -1) {
                    const card = this.energies.cards.splice(index, 1);
                    destination.cards.push(card[0]);
                    // If destination is a PokemonCardList and card came from energies, add to destination energies.cards
                    // (This handles both regular energy cards and Pokemon-as-energy cards)
                    if (destination instanceof PokemonCardList) {
                        if (!destination.energies.cards.includes(card[0])) {
                            destination.energies.cards.push(card[0]);
                        }
                    }
                }
                else {
                    // If not found in cards or energies, check tools
                    index = this.tools.indexOf(cards[i]);
                    if (index !== -1) {
                        const card = this.tools.splice(index, 1);
                        destination.cards.push(card[0]);
                        // If destination is a PokemonCardList and card is an energy card, add to energies.cards
                        if (destination instanceof PokemonCardList) {
                            const isEnergyCard = card[0].superType === card_types_1.SuperType.ENERGY || card[0].energyType !== undefined;
                            if (isEnergyCard && !destination.energies.cards.includes(card[0])) {
                                destination.energies.cards.push(card[0]);
                            }
                        }
                    }
                }
            }
        }
    }
}
exports.PokemonCardList = PokemonCardList;
PokemonCardList.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
PokemonCardList.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
PokemonCardList.CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
PokemonCardList.CLEAR_KNOCKOUT_MARKER_2 = 'CLEAR_KNOCKOUT_MARKER_2';
PokemonCardList.KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
PokemonCardList.NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
PokemonCardList.NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';
PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = 'PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN';
PokemonCardList.CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN = 'CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN';
PokemonCardList.PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN = 'PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN';
PokemonCardList.CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN = 'CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN';
PokemonCardList.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER = 'OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER';
PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
PokemonCardList.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
PokemonCardList.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
PokemonCardList.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
PokemonCardList.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER';
PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER';
PokemonCardList.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
PokemonCardList.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
PokemonCardList.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER = 'PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER';
PokemonCardList.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';
PokemonCardList.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = 'PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';
PokemonCardList.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = 'CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';
PokemonCardList.UNRELENTING_ONSLAUGHT_MARKER = 'UNRELENTING_ONSLAUGHT_MARKER';
PokemonCardList.UNRELENTING_ONSLAUGHT_2_MARKER = 'UNRELENTING_ONSLAUGHT_2_MARKER';
