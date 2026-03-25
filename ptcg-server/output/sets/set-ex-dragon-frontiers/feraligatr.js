"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feraligatr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Feraligatr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Croconaw';
        this.tags = [card_types_1.CardTag.DELTA_SPECIES];
        this.cardType = L;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Battle Aura',
                powerType: game_1.PowerType.POKEBODY,
                text: 'Each of your Pokémon that has δ on its card does 10 more damage to the Defending Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Drag Off',
                cost: [C, C],
                damage: 20,
                text: 'Before doing damage, you may choose 1 of your opponent\'s Benched Pokémon and switch it with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.'
            },
            {
                name: 'Sharp Fang',
                cost: [L, L, C],
                damage: 60,
                text: ''
            }];
        this.set = 'DF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '2';
        this.name = 'Feraligatr';
        this.fullName = 'Feraligatr DF';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.AFTER_ATTACK)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                opponent.switchPokemon(cardList);
                const afterDamage = new attack_effects_1.DealDamageEffect(effect, 20);
                afterDamage.target = opponent.active;
                store.reduceEffect(state, afterDamage);
            });
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && game_1.StateUtils.isPokemonInPlay(effect.player, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            const source = effect.source.getPokemonCard();
            if (state.phase === game_1.GamePhase.ATTACK &&
                source.tags.includes(card_types_1.CardTag.DELTA_SPECIES) &&
                effect.target === opponent.active && effect.damage > 0 && !(0, prefabs_1.IS_POKEBODY_BLOCKED)(store, state, player, this)) {
                effect.damage += 10;
            }
        }
        return state;
    }
}
exports.Feraligatr = Feraligatr;
