"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shiftryex = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useSkillHack(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const pokemonCardsInHand = opponent.hand.cards.filter(card => card instanceof pokemon_card_1.PokemonCard);
    if (pokemonCardsInHand.length === 0) {
        (0, prefabs_1.SHOW_CARDS_TO_PLAYER)(store, state, player, [...opponent.hand.cards]);
        return state;
    }
    let selectedCards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, opponent.hand, { superType: card_types_1.SuperType.POKEMON }, { min: 1, max: 1, allowCancel: false }), selected => {
        selectedCards = selected || [];
        next();
    });
    const selectedPokemon = selectedCards[0];
    if (!selectedPokemon || selectedPokemon.attacks.length === 0) {
        return state;
    }
    let selectedAttack = null;
    yield store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, [selectedPokemon], { allowCancel: false }), attack => {
        selectedAttack = attack;
        next();
    });
    if (selectedAttack === null) {
        return state;
    }
    const copiedAttack = selectedAttack;
    store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
        name: player.name,
        attack: copiedAttack.name
    });
    const attackEffect = new game_effects_1.AttackEffect(player, opponent, copiedAttack);
    state = store.reduceEffect(state, attackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    if (attackEffect.damage > 0) {
        const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
    }
    return state;
}
class Shiftryex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Nuzleaf';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = D;
        this.hp = 140;
        this.weakness = [{ type: G }, { type: F }];
        this.resistance = [{ type: P, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Skill Hack',
                cost: [D],
                damage: 0,
                text: 'Look at your opponent\'s hand and choose a Basic Pokémon or Evolution card you find there. Choose 1 of that Pokémon\'s attacks. Skill Hack copies that attack except for its Energy cost. (You must still do anything else required for that attack.) (No matter what type that Pokémon is, Shiftry ex\'s type is still [D].) Shiftry ex performs that attack.'
            },
            {
                name: 'Dirge',
                cost: [D, C, C],
                damage: 60,
                text: 'Does 60 damage to each of your opponent\'s Benched Pokémon that has the same name as the Defending Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'PK';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.name = 'Shiftry ex';
        this.fullName = 'Shiftry ex PK';
    }
    reduceEffect(store, state, effect) {
        // Ref: set-secret-wonders/mew.ts (Re-creation)
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const generator = useSkillHack(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            effect.opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                var _a, _b;
                if (cardList === effect.opponent.active) {
                    return;
                }
                if (((_a = cardList.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.name) === ((_b = effect.opponent.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.name)) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                    damageEffect.target = cardList;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        return state;
    }
}
exports.Shiftryex = Shiftryex;
