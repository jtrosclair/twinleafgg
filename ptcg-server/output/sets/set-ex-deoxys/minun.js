"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minun = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Minun extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Sniff Out',
                cost: [C],
                damage: 0,
                text: 'Put any 1 card from your discard pile into your hand.'
            },
            {
                name: 'Negative Spark',
                cost: [L],
                damage: 0,
                text: 'Does 20 damage to each of your opponent\'s Pokémon that has any Poké- Bodies. Don\'t apply Weakness and Resistance.'
            }];
        this.set = 'DX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Minun';
        this.fullName = 'Minun DX';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            (0, prefabs_1.BLOCK_IF_DISCARD_EMPTY)(player);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 1, allowCancel: false }), cards => {
                (0, prefabs_1.MOVE_CARDS)(store, state, player.discard, player.hand, { cards: cards, sourceCard: this, sourceEffect: this.attacks[0] });
            });
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonWithPokeBodies = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (cardList.getPokemonCard()) {
                    const powersEffect = new check_effects_1.CheckPokemonPowersEffect(opponent, card);
                    state = store.reduceEffect(state, powersEffect);
                    if (powersEffect.powers.some(power => power.powerType === game_1.PowerType.POKEBODY)) {
                        pokemonWithPokeBodies.push(cardList);
                    }
                }
            });
            effect.ignoreWeakness = true;
            effect.ignoreResistance = true;
            pokemonWithPokeBodies.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
            return state;
        }
        return state;
    }
}
exports.Minun = Minun;
