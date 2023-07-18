<template>
  <ul class="colors">
    <li class="colors__item" v-for="color in product.colorsId" :key="color">
      <label class="colors__label">
        <input
          class="colors__radio sr-only"
          type="radio"
          value="color"
          checked=""
        />
        <span class="colors__value" :style="{'background-color' : color.colorCode}"> </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['product'],
};
</script>
