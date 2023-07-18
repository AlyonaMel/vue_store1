<template>
  <div >
    <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id}}">
      <img :src="product.image" :alt="product.title" />
    </router-link>

    <h3 class="catalog__title">
      <a href="#"> {{ product.title }} </a>
    </h3>

    <span class="catalog__price"> {{ product.price | numberFormat }} руб.</span>

    <ul class="colors colors--black">
      <li class="colors__item" v-for="productColor in product.colors" :key="productColor.id">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            :value="productColor.id" v-model="color"
          />
          <span class="colors__value"
          :style="{'background-color' : productColor.code}"></span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['product'],
  filters: {
    numberFormat,
  },
  data() {
    return {
      color: 0,
    };
  },
  watch: {
    product: {
      handler(value) {
        this.color = value.colors[0].id;
      },
      immediate: true,
    },
  },
  methods: {
    gotoPage,
  },
};
</script>
