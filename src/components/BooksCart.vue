<template>
  <div class="cart">
    <h3>Carrito</h3>
    <ul v-if="cart.length">
      <li v-for="book in cart" :key="book.id">
        {{ book.title }} - {{ book.price }}€
      </li>
    </ul>
    <p v-else>El carrito está vacío</p>
  </div>
</template>

<script setup>
import { useBookStore } from '../stores/bookStore'
import { computed } from 'vue'

const store = useBookStore()
const cart = computed(() => store.cart)
</script>

<style scoped>
.cart {
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0;
    background: #333;
}
</style>
