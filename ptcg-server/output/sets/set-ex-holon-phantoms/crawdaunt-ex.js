"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawdauntEx = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CrawdauntEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Corphish';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 110;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Splash Back',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if your opponent has 4 or more Benched Pokémon, you may choose 1 of them and return that Pokémon and all cards attached to it to his or her hand. This power can\'t be used if Crawdaunt ex is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Power Blow',
                cost: [W, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Does 20 damage times the amount of Energy attached to Crawdaunt ex.'
            }];
        this.set = 'HP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '99';
        this.name = 'Crawdaunt ex';
        this.fullName = 'Crawdaunt ex HP';
        this.SPLASH_BACK_MARKER = 'SPLASH_BACK_MARKER';
    }
    reduceEffect(store, state, effect) {
        (0, prefabs_1.REMOVE_MARKER_AT_END_OF_TURN)(effect, this.SPLASH_BACK_MARKER, this);
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && (0, prefabs_1.HAS_MARKER)(this.SPLASH_BACK_MARKER, effect.player, this)) {
            effect.player.marker.removeMarker(this.SPLASH_BACK_MARKER, this);
        }
        if ((0, prefabs_1.WAS_POWER_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            if (benched < 4) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.BLOCK_IF_HAS_SPECIAL_CONDITION)(player, this);
            if ((0, prefabs_1.HAS_MARKER)(this.SPLASH_BACK_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            (0, prefabs_1.ADD_MARKER)(this.SPLASH_BACK_MARKER, player, this);
            (0, prefabs_1.ABILITY_USED)(player, this);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1 }), selected => {
                const cardList = selected[0] || [];
                if (cardList) {
                    const pokemons = cardList.getPokemons();
                    const otherCards = cardList.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard) &&
                        !pokemons.includes(card) &&
                        (!cardList.tools || !cardList.tools.includes(card)));
                    const tools = [...cardList.tools];
                    // Move other cards to hand
                    if (otherCards.length > 0) {
                        (0, prefabs_1.MOVE_CARDS)(store, state, cardList, opponent.hand, { cards: otherCards });
                    }
                    // Move tools to hand
                    if (tools.length > 0) {
                        for (const tool of tools) {
                            cardList.moveCardTo(tool, opponent.hand);
                        }
                    }
                    // Move Pokémon to hand
                    if (pokemons.length > 0) {
                        (0, prefabs_1.MOVE_CARDS)(store, state, cardList, opponent.hand, { cards: pokemons });
                    }
                }
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const cardList = player.active;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
            store.reduceEffect(state, checkProvidedEnergy);
            const energyCount = checkProvidedEnergy.energyMap.length;
            effect.damage = 20 * energyCount;
        }
        return state;
    }
}
exports.CrawdauntEx = CrawdauntEx;
