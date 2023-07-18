<template>
  <div class="product__counter form__counter">
    <button
      type="button"
      @click.prevent="productAmount--"
      aria-label="Убрать один товар"
    >
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input type="text" v-model.number="productAmount" />

    <button
      type="button"
      @click.prevent="productAmount++"
      aria-label="Добавить один товар"
    >
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['counter'],
  filters: { numberFormat },
  data() {
    return {
      productAmount: 1,
    };
  },
  watch: {
    productAmount(value, prevValue) {
      if (Number.isNaN(+this.productAmount) || this.productAmount <= 0) {
        this.productAmount = prevValue;
      } else {
        this.$emit('update:counter', +this.productAmount);
      }
    },
  },
  created() {
    if (this.counter) {
      this.productAmount = this.counter;
    }
  },
};
</script>
