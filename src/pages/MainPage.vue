<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :filter-color.sync="filterColor"
      />
      <section class="catalog">
        <div v-if="productsLoading" class="cssload-wrap">
          <div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div>Загрузка товаров...</div>
        </div>
        <div v-if="productsLoadingFailed">
          Произошла ошибка при загрузке...
          <button @click.prevent="loadProducts">Попробуйте еще раз</button>
        </div>
        <ProductList :products="products" />
        <BasePagination
          v-model="page"
          :count="countProducts"
          :per-page="productsPerPage"
        />
      </section>
    </div>
  </main>
</template>

<script>
import axios from 'axios';
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import { API_BASE_URL } from '@/config';

export default {
  components: { ProductList, BasePagination, ProductFilter },
  data() { // Создание свойств для полей фильтра
    return {
      // устанавливаем значение по умолчанию
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColor: 0,
      page: 1,
      productsPerPage: 3,
      loadeState: true,

      productsData: null, // свойство состояния для API
      productsLoading: false, // Загрузка товара
      productsLoadingFailed: false, // Ошибка загрузки товара
    };
  },
  computed: {
    // вычисляемое свойство для пагинации
    products() {
      return this.productsData
        ? this.productsData.items.map((product) => ({
          ...product,
          image: product.image.file.url,
        }))
        : [];
    },
    // общее количество товаров
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(`${API_BASE_URL}/api/products`, {
            params: {
              page: this.page,
              limit: this.productsPerPage,
              categoryId: this.filterCategoryId,
              colorId: this.filterColor,
              minPrice: this.filterPriceFrom,
              maxPrice: this.filterPriceTo,
            },
          })
          .then((response) => {
            this.productsData = response.data;
          }) // Загрузка товаров
          .catch(() => {
            this.productsLoadingFailed = true;
          }) // Сообщение об ошибке
          .then(() => {
            this.productsLoading = false;
          }); // Обновление запроса на загрузку товаров
      }, 2000);
    },
  },
  watch: {
    // добавляем наблюдатель
    page() {
      // наблюдаем за свойством page
      this.loadProducts(); // и, если оно изменилось, вызываем метод loadProducts
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterColor() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>

<style>
.cssload-wrap {
  padding-top: 25vh;
}

.cssload-wrap > div {
  left: calc(50% - 97px);
  position: relative;
  background-color: rgb(255, 255, 255);
  width: 195px;
  height: 195px;
  border-radius: 100%;
  -o-border-radius: 100%;
  -ms-border-radius: 100%;
  -webkit-border-radius: 100%;
  -moz-border-radius: 100%;
  overflow: hidden;
  color: rgb(0, 0, 0);
}
.cssload-wrap > div:nth-child(2) {
  width: 175px;
  height: 175px;
  top: -185px;
  left: calc(50% - 88px);
  line-height: 175px;
  text-align: center;
}
.cssload-wrap > div div {
  width: 146px;
  height: 146px;
  border-radius: 100%;
  -o-border-radius: 100%;
  -ms-border-radius: 100%;
  -webkit-border-radius: 100%;
  -moz-border-radius: 100%;
  filter: blur(29px);
  -o-filter: blur(29px);
  -ms-filter: blur(29px);
  -webkit-filter: blur(29px);
  -moz-filter: blur(29px);
  position: absolute;
}
.cssload-wrap > div div:nth-child(1) {
  background-color: red;
  animation: cssload-move 4.6s;
  -o-animation: cssload-move 4.6s;
  -ms-animation: cssload-move 4.6s;
  -webkit-animation: cssload-move 4.6s;
  -moz-animation: cssload-move 4.6s;
  animation-delay: 5.52s;
  -o-animation-delay: 5.52s;
  -ms-animation-delay: 5.52s;
  -webkit-animation-delay: 5.52s;
  -moz-animation-delay: 5.52s;
  animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-timing-function: linear;
  -o-animation-timing-function: linear;
  -ms-animation-timing-function: linear;
  -webkit-animation-timing-function: linear;
  -moz-animation-timing-function: linear;
}
.cssload-wrap > div div:nth-child(2) {
  background-color: green;
  animation: cssload-move 3.45s;
  -o-animation: cssload-move 3.45s;
  -ms-animation: cssload-move 3.45s;
  -webkit-animation: cssload-move 3.45s;
  -moz-animation: cssload-move 3.45s;
  animation-delay: 0s;
  -o-animation-delay: 0s;
  -ms-animation-delay: 0s;
  -webkit-animation-delay: 0s;
  -moz-animation-delay: 0s;
  animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-timing-function: linear;
  -o-animation-timing-function: linear;
  -ms-animation-timing-function: linear;
  -webkit-animation-timing-function: linear;
  -moz-animation-timing-function: linear;
}
.cssload-wrap > div div:nth-child(3) {
  background-color: blue;
  animation: cssload-move 6.9s;
  -o-animation: cssload-move 6.9s;
  -ms-animation: cssload-move 6.9s;
  -webkit-animation: cssload-move 6.9s;
  -moz-animation: cssload-move 6.9s;
  animation-delay: 3.68s;
  -o-animation-delay: 3.68s;
  -ms-animation-delay: 3.68s;
  -webkit-animation-delay: 3.68s;
  -moz-animation-delay: 3.68s;
  animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-timing-function: linear;
  -o-animation-timing-function: linear;
  -ms-animation-timing-function: linear;
  -webkit-animation-timing-function: linear;
  -moz-animation-timing-function: linear;
}
.cssload-wrap > div div:nth-child(4) {
  background-color: yellow;
  animation: cssload-move 5.75s;
  -o-animation: cssload-move 5.75s;
  -ms-animation: cssload-move 5.75s;
  -webkit-animation: cssload-move 5.75s;
  -moz-animation: cssload-move 5.75s;
  animation-delay: 1.84s;
  -o-animation-delay: 1.84s;
  -ms-animation-delay: 1.84s;
  -webkit-animation-delay: 1.84s;
  -moz-animation-delay: 1.84s;
  animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  animation-timing-function: linear;
  -o-animation-timing-function: linear;
  -ms-animation-timing-function: linear;
  -webkit-animation-timing-function: linear;
  -moz-animation-timing-function: linear;
}

@keyframes cssload-move {
  0%,
  100% {
    top: 0%;
    left: 0%;
  }
  25% {
    top: 0%;
    left: 50%;
  }
  50% {
    top: 50%;
    left: 50%;
  }
  75% {
    top: 50%;
    left: 0%;
  }
}

@-o-keyframes cssload-move {
  0%,
  100% {
    top: 0%;
    left: 0%;
  }
  25% {
    top: 0%;
    left: 50%;
  }
  50% {
    top: 50%;
    left: 50%;
  }
  75% {
    top: 50%;
    left: 0%;
  }
}

@-ms-keyframes cssload-move {
  0%,
  100% {
    top: 0%;
    left: 0%;
  }
  25% {
    top: 0%;
    left: 50%;
  }
  50% {
    top: 50%;
    left: 50%;
  }
  75% {
    top: 50%;
    left: 0%;
  }
}

@-webkit-keyframes cssload-move {
  0%,
  100% {
    top: 0%;
    left: 0%;
  }
  25% {
    top: 0%;
    left: 50%;
  }
  50% {
    top: 50%;
    left: 50%;
  }
  75% {
    top: 50%;
    left: 0%;
  }
}

@-moz-keyframes cssload-move {
  0%,
  100% {
    top: 0%;
    left: 0%;
  }
  25% {
    top: 0%;
    left: 50%;
  }
  50% {
    top: 50%;
    left: 50%;
  }
  75% {
    top: 50%;
    left: 0%;
  }
}
</style>
