<template>
  <router-link class="header__cart" aria-label="Корзина с товарами" :to="{name: 'cart'}">
    <svg width="30" height="21" fill="currentColor">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <!-- получаем доступ к хранилищу через $store, состояние хранится в свойстве state,
    далее указываем нужное свойство, например cartProducts, и, допустим,
    посчитать и вывести, сколько элементов в массиве-->
    <span class="header__count" aria-label="Количество товаров">
      {{ $store.state.cartProducts.length }}
      </span>
  </router-link>
</template>

<script>export default {

};
</script>
