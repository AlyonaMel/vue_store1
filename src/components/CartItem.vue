<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.product.image.file.url"
        width="120"
        height="120"
        :alt="item.product.title"
      />
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <span class="product__code"> Артикул: {{ item.product.id }} </span>

    <QuantityChange :counter.sync="amount"/>
    <b class="product__price">
      {{ (item.amount * item.product.price) | numberFormat }} руб.
    </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteFromBasket(item.productId)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import { mapMutations } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import QuantityChange from '@/components/QuantityChange.vue';

export default {
  props: ['item'],
  components: { QuantityChange },
  filters: { numberFormat },
  data() {
    return { productAmount: 1 };
  },
  methods: {
    ...mapMutations({ deleteProduct: 'deleteCartProduct' }),
    deleteFromBasket(productId) { // удаление из корзины для API
      this.$store.dispatch('deleteCartProduct', { productId });
    },
  },
  computed: {
    amount: {
      get() { // будет возвращать значение количества из входного параметра
        return this.item.amount;
      },
      set(value) { // будет вызывать действие по изменению количества
        this.$store.dispatch('updateCartProductAmount', { productId: this.item.productId, amount: value });
      },
    },
  },
};
</script>
