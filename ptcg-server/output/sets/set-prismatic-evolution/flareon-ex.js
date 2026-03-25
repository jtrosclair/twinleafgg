"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flareonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_3 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useBurningCharge(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    const hasBenched = player.bench.some(b => b.cards.length > 0);
    if (!hasBenched) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_2.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        yield store.prompt(state, new game_2.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_3.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
            if (!targets || targets.length === 0) {
                return;
            }
            const target = targets[0];
            player.deck.moveCardsTo(cards, target);
            next();
        });
    }
    return store.prompt(state, new game_2.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Flareonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = R;
        this.hp = 270;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Burning Charge',
                cost: [R, C],
                damage: 130,
                text: 'Search your deck for up to 2 Basic Energy and attach them to 1 of your Pokemon. Then, shuffle your deck.'
            },
            {
                name: 'Carnelian',
                cost: [R, W, L],
                damage: 280,
                text: 'During your next turn, this Pokemon can\'t attack.'
            }];
        this.regulationMark = 'H';
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Flareon ex';
        this.fullName = 'Flareon ex PRE';
    }
    reduceEffect(store, state, effect) {
        // Burning Charge
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useBurningCharge(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        // Carnelian
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            player.active.cannotAttackNextTurnPending = true;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            effect.preventDefault = true;
        }
        return state;
    }
}
exports.Flareonex = Flareonex;
