"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sudowoodo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
class Sudowoodo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Watch and Learn',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 0,
                copycatAttack: true,
                text: 'If your opponent\'s Pokémon used an attack during his or her last turn, use it as this attack.'
            }];
        this.set = 'BKP';
        this.setNumber = '67';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sudowoodo';
        this.fullName = 'Sudowoodo BKP';
        //   public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
        //     if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
        //       const player = effect.player;
        //       const opponent = StateUtils.getOpponent(state, player);
        //       const lastAttack = state.lastAttack;
        //       if (!lastAttack || lastAttack.copycatAttack === true || lastAttack.gxAttack === true) {
        //         return state;
        //       }
        //       // Find the original card that used the last attack
        //       const originalCard = this.findOriginalCard(state, lastAttack);
        //       if (!originalCard) {
        //         return state;
        //       }
        //       return store.prompt(state, new ChooseAttackPrompt(
        //         player.id,
        //         GameMessage.CHOOSE_ATTACK_TO_COPY,
        //         [originalCard],
        //         { allowCancel: true, blocked: [] }
        //       ), attack => {
        //         if (attack.name !== lastAttack.name) {
        //           throw new GameError(GameMessage.CANNOT_USE_ATTACK);
        //         }
        //         if (attack !== null) {
        //           state = this.executeCopiedAttack(store, state, player, opponent, attack);
        //         }
        //         return state;
        //       });
        //     }
        //     return state;
        //   }
        //   private executeCopiedAttack(
        //     store: StoreLike,
        //     state: State,
        //     player: Player,
        //     opponent: Player,
        //     attack: Attack
        //   ): State {
        //     const copiedAttackEffect = new AttackEffect(player, opponent, attack);
        //     state = store.reduceEffect(state, copiedAttackEffect);
        //     if (copiedAttackEffect.attack.shredAttack === true && copiedAttackEffect.damage > 0) {
        //       // Apply damage and trigger AfterDamageEffect
        //       opponent.active.damage += copiedAttackEffect.damage;
        //       const afterDamage = new AfterDamageEffect(copiedAttackEffect, copiedAttackEffect.damage);
        //       state = store.reduceEffect(state, afterDamage);
        //     }
        //     if (copiedAttackEffect.attack.shredAttack !== true && copiedAttackEffect.damage > 0) {
        //       const dealDamage = new DealDamageEffect(copiedAttackEffect, copiedAttackEffect.damage);
        //       state = store.reduceEffect(state, dealDamage);
        //     }
        //     return state;
        //   }
        //   private findOriginalCard(state: State, lastAttack: Attack): PokemonCard | null {
        //     let originalCard: PokemonCard | null = null;
        //     state.players.forEach(player => {
        //       player.forEachPokemon(PlayerType.BOTTOM_PLAYER && PlayerType.TOP_PLAYER, (cardList, card) => {
        //         if (card.attacks.some(attack => attack === lastAttack)) {
        //           originalCard = card;
        //         }
        //       });
        //       // Check deck, discard, hand, and lost zone
        //       [player.deck, player.discard, player.hand, player.lostzone].forEach(cardList => {
        //         cardList.cards.forEach(card => {
        //           if (card instanceof PokemonCard && card.attacks.some(attack => attack === lastAttack)) {
        //             originalCard = card;
        //           }
        //         });
        //       });
        //     });
        //     return originalCard;
        //   }
    }
}
exports.Sudowoodo = Sudowoodo;
