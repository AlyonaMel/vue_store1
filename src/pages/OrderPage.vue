<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}" >Каталог</router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}">Корзина</router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">Оформление заказа</a>
        </li>
      </ul>

      <h1 class="content__title">Корзина</h1>
      <div class="content__info"> Количество наименований: {{ totalItems }} </div>
      <div class="content__info"> Количество штук: {{ totaProducts }} </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText v-model="formData.name" title="ФИО" :error="formError.name"
            placeholder="Введите Ваше полное имя" type="text" />

            <BaseFormText v-model="formData.address" title="Адрес доставки"
            :error="formError.address" placeholder="Введите Ваш адрес" type="text" />

            <BaseFormText v-model="formData.phone" title="Телефон"
            :error="formError.phone" placeholder="Введите Ваш телефон" type="tel" />

            <BaseFormText v-model="formData.email" title="Email"
            :error="formError.email" placeholder="Введи Ваш Email" type="email" />

            <BaseFormTextarea v-model="formData.comment" title="Комментарий к заказу"
            :error="formError.comment" placeholder="Ваши пожелания"/>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input
                    v-model="courierDelivery"
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    value="0"
                  />
                  <span class="options__value">
                    Самовывоз <b>0 руб.</b>
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input
                    v-model="courierDelivery"
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    value="500"
                  />
                  <span class="options__value"> Курьером <b>500 руб.</b> </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    value="card"
                    v-model="paymentMethod"
                  />
                  <span class="options__value"> Картой при получении </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    value="cash"
                    v-model="paymentMethod"
                  />
                  <span class="options__value"> Наличными при получении </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <CartBlock  v-for="item in products" :key="item.productId" :item="item" />
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>{{courierDelivery}} руб.</b></p>
            <p>Итого штук: <b>{{ totaProducts }}</b> на сумму
            <b>{{totalPriceWithDelivery | numberFormat}} руб. (стоимость доставки включена)</b></p>
          </div>

          <button class="cart__button button button--primery" v-if="products.length > 0"
            type="submit">
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
            {{formErrorMessage}}
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import numberFormat from '@/helpers/numberFormat';
import CartBlock from '@/components/CartBlock.vue';
import { API_BASE_URL } from '@/config';

export default {
  components: { CartBlock, BaseFormText, BaseFormTextarea },
  filters: { numberFormat },
  data() {
    return {
      paymentMethod: null, // переменная для способа оплаты
      courierDelivery: 0, // переменная для доставки
      formData: {}, // свойство для формы
      formError: {}, // свойство для обработки ошибок
      formErrorMessage: '', // свойство сообщения об ошибке
      preLoader: false, // прелоадер
    };
  },
  methods: {
    order() { // создание функции для отправки данных заказа товара для API
      this.formError = {}; // очиста запроса после заполнения формы
      this.formErrorMessage = ''; // сброс значения сообщения об ошибке при отправке
      axios.post(`${API_BASE_URL}/api/orders`, { // Отправка запроса
        ...this.formData,
      }, {
        params: {
          userAccessKey: this.$store.state.userAccessKey,
        },
      })
        .then((response) => {
          this.$store.commit('resetCart'); // вызов мутации для очиски корзины
          this.$store.commit('updateOrderInfo', response.data); // вызов мутации для обработки инфо заказа
          // перенаправление на страницу заказа
          this.$router.push({ name: 'orderInfo', params: { id: response.data.id, deliveryPrice: this.courierDelivery, paymentMethod: this.paymentMethod } });
        })
        .catch((error) => { // отлов ошибок
          this.formError = error.response.data.error.request || {};
          this.formErrorMessage = error.response.data.error.message;
        });
    },
  },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      totalItems: 'cartTotalItems',
      totaProducts: 'cartTotalProducts',
    }),
    totalPriceWithDelivery() { // стоимость товаров с учётом доставки
      return this.totalPrice + +this.courierDelivery;
    },
  },
};
</script>
