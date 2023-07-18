<template>
  <main class="content container" v-if="productLoading">Загрузка товара...</main>
  <main class="content container" v-else-if="!productData">Не удалоcь загрузить товар</main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a
            class="breadcrumbs__link"
            @click.prevent="$router.push({ name: 'main' })"
          >
            {{ category.title }}
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> {{ product.title }} </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img
            width="570"
            v-bind:src="product.image.file.url" v-bind:alt="product.title"
          />
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">{{ product.title }}</h2>
        <div class="item__form">
          <form
            class="form"
            action="#"
            method="POST"
            @submit.prevent="addToCart"
          >
            <b class="item__price"> {{ product.price | numberFormat }} руб.</b>

            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">
                <li
                  class="colors__item"
                  v-for="productColor in product.colors"
                  :key="productColor.id"
                >
                  <label class="colors__label">
                    <input
                      class="colors__radio sr-only"
                      type="radio"
                      :value="productColor.id"
                      v-model="color"
                    />
                    <span
                      class="colors__value"
                      :style="{ 'background-color': productColor.code }"
                    ></span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <div class="item__row">
              <QuantityChange :counter.sync="productAmount"/>

              <button class="button button--primery" type="submit" :disabled="productAddSending">
                В корзину
              </button>
            </div>
              <div v-show="productAdded">Товар добавлен в корзину</div>
              <div v-show="productAddSending">Добавляем товар в корзину</div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link tabs__link--current"> Описание </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Характеристики </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Гарантия </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Оплата и доставка </a>
          </li>
        </ul>

        <div class="item__content">
          <p>
            Навигация GPS, ГЛОНАСС, BEIDOU Galileo и QZSS<br />
            Синхронизация со смартфоном<br />
            Связь по Bluetooth Smart, ANT+ и Wi-Fi<br />
            Поддержка сторонних приложений<br />
          </p>

          <a href="#"> Все характеристики </a>

          <h3>Что это?</h3>

          <p>
            Wahoo ELEMNT BOLT GPS – это велокомпьютер, который позволяет
            оптимизировать свои велотренировки, сделав их максимально
            эффективными. Wahoo ELEMNT BOLT GPS синхронизируется с датчиками по
            ANT+, объединяя полученную с них информацию. Данные отображаются на
            дисплее, а также сохраняются на смартфоне. При этом на мобильное
            устройство можно установить как фирменное приложение, так и
            различные приложения сторонних разработчиков. Велокомпьютер точно
            отслеживает местоположение, принимая сигнал с целого комплекса
            спутников. Эта информация позволяет смотреть уже преодоленные
            маршруты и планировать новые велопрогулки.
          </p>

          <h3>Дизайн</h3>

          <p>
            Велокомпьютер Wahoo ELEMNT BOLT очень компактный. Размеры устройства
            составляют всего 74,6 x 47,3 x 22,1 мм. что не превышает габариты
            смартфона. Корпус гаджета выполнен из черного пластика. На
            обращенной к пользователю стороне расположен дисплей диагональю 56
            мм. На дисплей выводятся координаты и скорость, а также полученная
            со смартфона и синхронизированных датчиков информация:
            интенсивность, скорость вращения педалей, пульс и т.д. (датчики не
            входят в комплект поставки). Корпус велокомпьютера имеет степень
            защиты от влаги IPX7. Это означает, что устройство не боится пыли, а
            также выдерживает кратковременное (до 30 минут) погружение в воду на
            глубину не более 1 метра.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';
import QuantityChange from '@/components/QuantityChange.vue';
import { API_BASE_URL } from '@/config';

export default {
  data() {
    return {
      productAmount: 1,

      productData: null, // Свойство для API продукта
      productLoading: false, // Загрузка данных
      productLoadingFailed: false, // Обработка ошибок

      productAdded: false, // создание сообщения о том, что товар добавился в корзину
      productAddSending: false, // создание сообщения,что товар в процессе добавления в корзину
    };
  },
  filters: {
    numberFormat,
  },
  components: { QuantityChange },
  computed: {
    // вычисляемое свойство, которое будет возвращать инфо о просматриваемом товаре
    product() {
      // чтобы получить инфо о товаре, нужно отфильтровать список всех товаров и оставить там
      // только тот товар, который просматриваем (инфо находим в pageParams)
      return this.productData;
    },
    category() { // вычисляемое свойтсво для категории
      // в справочнике категорий находим ту категорию, у которой id совпадает с id категории товара
      return this.productData.category;
    },
  },
  methods: {
    ...mapActions(['addProductToCart']), // подмешивание действия в метод компонента
    gotoPage,
    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;
      this.addProductToCart({ productId: this.product.id, amount: this.productAmount })
        .then(() => {
          this.productAdded = true;
          this.productAddSending = false;
        });
    },
    loadProduct() {
      this.productLoading = true;
      this.productLoadingFailed = false;
      axios.get(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
        .then((response) => { this.productData = response.data; }) // Загрузка товаров
        .catch(() => { this.productLoadingFailed = true; }) // Сообщение об ошибке
        .then(() => { this.productLoading = false; }); // Обновление запроса на загрузку товаров
    },
  },
  watch: {
    '$route.params.id': { // Отслеживание динамического сегмнта для изменения адреса страниц
      handler() { // обработчик будет срабатывать при создании и изменении экземпляра компонента
        this.loadProduct();
      },
      immediate: true,
    },
  },
};
</script>
