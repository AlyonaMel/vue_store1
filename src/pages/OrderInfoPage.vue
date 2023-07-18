<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}" >Каталог</router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}">Корзина</router-link>
        </li><li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'order'}">
            Оформление заказа</router-link>
        </li>
      </ul>

      <h1 class="content__title">Заказ оформлен <span>№
         {{this.orderInfo ? this.orderInfo.id : id}}</span></h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет
            письмо с&nbsp;деталями заказа. Наши менеджеры свяжутся с&nbsp;Вами
            в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key"> Получатель </span>
              <span class="dictionary__value">
                {{orderInfo.name}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Адрес доставки </span>
              <span class="dictionary__value">
                {{orderInfo.address}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Телефон </span>
              <span class="dictionary__value"> {{orderInfo.phone}} </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Email </span>
              <span class="dictionary__value"> {{orderInfo.email}} </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Способ оплаты </span>
              <span class="dictionary__value">{{paymentMethod}}</span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <CartBlock  v-for="item in orderInfo.basket.items"
            :key="item.productId" :item="item" />
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>{{this.$route.params.deliveryPrice}} руб.</b></p>
            <p>Итого: {{totalPriceWithDelivery | numberFormat}} руб.
              (стоимость доставки включена)</p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import numberFormat from '@/helpers/numberFormat';
import CartBlock from '@/components/CartBlock.vue';

export default {
  props: ['id'],
  components: { CartBlock },
  filters: { numberFormat },
  data() {
    return {
      courierDelivery: 0,
    };
  },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      totalItems: 'cartTotalItems',
      totaProducts: 'cartTotalProducts',
    }),
    orderInfo() {
      return this.$store.state.orderInfo;
    },
    itemsCount() { // вывод количества товара
      return this.orderInfo.basket.items.reduce((acc, item) => acc + item.amount, 0);
    },
    totalPriceWithDelivery() { // вывод общей суммы
      return this.orderInfo.totalPrice + +this.$route.params.deliveryPrice;
    },
    paymentMethod() { // вывод вариантов способа оплаты
      return `${this.$route.params.paymentMethod === 'card' ? 'картой' : 'наличными'} при получении`;
    },
  },
  mounted() {
    this.$store.dispatch('loadOrderInfo', this.$route.params.id);
  },
  // created() {
  //   this.$store.dispatch('loadOrderInfo', this.$route.params.id);
  // },
};
</script>
