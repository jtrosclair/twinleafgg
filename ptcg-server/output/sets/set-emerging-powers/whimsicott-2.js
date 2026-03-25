"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whimsicott2 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const choose_attack_prompt_1 = require("../../game/store/prompts/choose-attack-prompt");
class Whimsicott2 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cottonee';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: W, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Encore',
                cost: [C],
                damage: 20,
                text: 'Choose 1 of the Defending Pokémon\'s attacks. During your opponent\'s next turn, that Pokémon can only use that attack.'
            },
            {
                name: 'U-turn',
                cost: [G, G],
                damage: 40,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'EPO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Whimsicott';
        this.fullName = 'Whimsicott EPO 12';
        this.ENCORE_MARKER = 'ENCORE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defendingPokemon = opponent.active.getPokemonCard();
            if (defendingPokemon && defendingPokemon.attacks.length > 0) {
                return store.prompt(state, new choose_attack_prompt_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, [defendingPokemon], { allowCancel: false }), chosenAttack => {
                    if (chosenAttack) {
                        opponent.active.marker.addMarker(this.ENCORE_MARKER + ':' + chosenAttack.name, this);
                    }
                });
            }
        }
        if ((0, prefabs_1.WAS_ATTACK_USED)(effect, 1, this)) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench) {
                return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                    const target = targets[0];
                    player.switchPokemon(target);
                });
            }
        }
        // Encore effect - restrict attacks
        if (effect instanceof game_effects_1.AttackEffect) {
            const player = effect.player;
            const markers = player.active.marker.markers.filter(m => m.name.startsWith(this.ENCORE_MARKER + ':'));
            if (markers.length > 0) {
                const allowedAttack = markers[0].name.replace(this.ENCORE_MARKER + ':', '');
                if (effect.attack.name !== allowedAttack) {
                    throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
                }
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const markers = opponent.active.marker.markers.filter(m => m.name.startsWith(this.ENCORE_MARKER + ':'));
            markers.forEach(m => opponent.active.marker.removeMarker(m.name, this));
        }
        return state;
    }
}
exports.Whimsicott2 = Whimsicott2;
