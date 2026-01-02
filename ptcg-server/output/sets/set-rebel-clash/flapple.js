"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flapple = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Flapple extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Applin';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Apple Drop',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may put 2 damage counters on 1 of your opponent\'s Pokémon. If you placed any damage counters in this way, shuffle this Pokémon and all attached cards into your deck.'
            }];
        this.attacks = [{
                name: 'Acid Spray',
                cost: [C, C],
                damage: 60,
                text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
            }];
        this.set = 'RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Flapple';
        this.fullName = 'Flapple RCL';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.length > 0) {
                    const damageEffect = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, targets[0]);
                    store.reduceEffect(state, damageEffect);
                    if (damageEffect.target) {
                        damageEffect.target.damage += 20;
                        const thisCardList = game_1.StateUtils.findCardList(state, this);
                        // Shuffle this Pokémon and all attached cards into your deck
                        // Separate Pokemon card from attached cards
                        const pokemons = thisCardList.getPokemons();
                        const otherCards = thisCardList.cards.filter(card => !(card instanceof pokemon_card_1.PokemonCard));
                        // Move other cards to deck first
                        if (otherCards.length > 0) {
                            prefabs_1.MOVE_CARDS(store, state, thisCardList, player.deck, { cards: otherCards });
                        }
                        // Move Pokemon to deck
                        if (pokemons.length > 0) {
                            prefabs_1.MOVE_CARDS(store, state, thisCardList, player.deck, { cards: pokemons });
                        }
                        prefabs_1.SHUFFLE_DECK(store, state, player);
                    }
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    // Defending Pokemon has no energy cards attached
                    if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                        return state;
                    }
                    let cards = [];
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        return store.reduceEffect(state, discardEnergy);
                    });
                }
                return state;
            });
        }
        return state;
    }
}
exports.Flapple = Flapple;
