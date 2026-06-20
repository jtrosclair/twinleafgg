"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lampent = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Lampent extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Litwick';
        this.cardType = P;
        this.hp = 90;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Returning Lights',
                cost: [P],
                damage: 0,
                text: 'Search your deck for up to 3 Lampent and put them onto your Bench.',
            }];
        this.set = 'M5';
        this.setNumber = '35';
        this.regulationMark = 'J';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lampent';
        this.fullName = 'Lampent M5';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-unbroken-bonds/krookodile.ts (deck interaction); prefabs SEARCH bench pattern — manual slots for variable max
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const slots = (0, prefabs_1.GET_PLAYER_BENCH_SLOTS)(player);
            const maxPut = Math.min(3, slots.length);
            if (player.deck.cards.length === 0 || maxPut === 0) {
                return state;
            }
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, name: 'Lampent' }, { min: 0, max: maxPut, allowCancel: false }), selected => {
                const cards = selected || [];
                cards.forEach((card, index) => {
                    const slot = slots[index];
                    if (slot && card instanceof pokemon_card_1.PokemonCard) {
                        store.reduceEffect(state, new play_card_effects_1.PlayPokemonFromDeckEffect(player, card, slot));
                    }
                });
                (0, prefabs_1.SHUFFLE_DECK)(store, state, player);
            });
        }
        return state;
    }
}
exports.Lampent = Lampent;
