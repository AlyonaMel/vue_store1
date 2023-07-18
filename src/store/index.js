import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

Vue.use(Vuex); // сообщаем vue, что будем использовать централизованное хранилище vuex

export default new Vuex.Store({ // создадим новое хранилище и экспортируем его
  state: {
    cartProducts: [],
    userAccessKey: null, // Создание уникального ключа пользователя с API
    cartProductsData: [], // Информация о товарах в корзине c API
    orderInfo: null, // Создание состояния для страницы информации о заказе
  },
  mutations: {
    updateOrderInfo(state, orderInfo) { // запись данных в orderInfo
      state.orderInfo = orderInfo;
    },
    resetCart(state) { // сброс корзины
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    // добавление товара и количества в корзину
    updateCartProductAmount(state, { productId, amount }) {
      // найдём товар в корзине, существует он или нет
      if (!Number.isNaN(amount)) { // проверка на товара число
        const item = state.cartProducts.find((product) => product.productId === productId);
        // и если он есть в корзине, то поменяем количество, а если
        // товара не было в корзине, то ничего не будем делать
        if (item) {
          item.amount = amount;
        }
      }
    },
    deleteCartProduct(state, productId) { // Удаление товара
      state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
    },
    updateUserAccessKey(state, accessKey) { // Изменение свойства ключа пользователя из API
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) { // Изменение информации о товаре из API
      state.cartProductsData = items;
    },
    // eslint-disable-next-line max-len
    syncCartProducts(state) { // мутация для синххрониции данных из API с оригинальным массивом CartProducts
      state.cartProducts = state.cartProductsData.map((item) => ({
        productId: item.product.id,
        amount: item.quantity,
      }));
    },
  },
  getters: { // геттэр - это функция, которая вычисляет какое-то значение и кэширует результат
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductsData.find((p) => p.product.id === item.productId);

        return {
          ...item,
          product, // Локальная база
          image: product.image.file.url,
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount)
      + acc, 0);
    },
    cartTotalItems(state, getters) {
      return getters.cartDetailProducts.length;
    },
    cartTotalProducts(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => item.amount + acc, 0);
    },
  },
  actions: {
    loadOrderInfo(context, orderId) { // загрузка данных о заказе по ID покупателя
      return axios
        .get(`${API_BASE_URL}/api/orders/${orderId}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        // при успешном запросе вызывается мутация для занесение информации в orderInfo
        .then((response) => {
          context.commit('updateOrderInfo', response.data);
        });
    },
    loadCart(context) { // Действие получения информации о корзине из API
      return axios
        .get(`${API_BASE_URL}/api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (!context.state.userAccessKey) { // проверка локального хранилища
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');// Вызов синхронизации
        });
    },
    addProductToCart(context, { productId, amount, colorId }) { // добавления товара в корзину
      return axios.post(`${API_BASE_URL}/api/baskets/products`, { // отправка запроса на сервер
        productId,
        quantity: amount,
        colorId,
      }, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts'); // вызов синхронизации
        });
    },
    // Создание действия для API при измении кол-ва товара
    updateCartProductAmount(context, { productId, amount }) {
      // вызов мутации, отвечающей за изменнение данных количества товара в массиве cartProducts
      context.commit('updateCartProductAmount', { productId, amount });

      if (amount < 1) {
        return;
      }

      axios
        .put(
          `${API_BASE_URL}/api/baskets/products`,
          {
            productId,
            quantity: amount,
          },
          {
            params: {
              userAccessKey: context.state.userAccessKey,
            },
          },
        )
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
        })
        .catch(() => { // вызов синхронизации при ошибке
          context.commit('syncCartProducts');
        });
    },
    // Создание действия для API при удалении товара
    deleteCartProduct(context, { productId }) {
      axios
        .delete(`${API_BASE_URL}/api/baskets/products`, {
          data: {
            productId,
          },
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCartProducts');
        });
    },
  },
});
