<template>
  <div id="books-cart">
    <h1>Tu Carrito</h1>
    <div id="list" v-if="cart.length">
       <BookItem v-for="book in cart" :key="book.id" :book="book">
         <template #actions>
           <button @click="store.removeFromCart(book.id)">
             <span class="material-icons">remove_shopping_cart</span>
           </button>
         </template>
       </BookItem>
    </div>
    <div v-else class="empty-cart">
        <p>Tu carrito está vacío</p>
        <RouterLink to="/">Ir a la tienda</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { useBookStore } from '../stores/bookStore'
import { computed } from 'vue'
import BookItem from './BookItem.vue'

const store = useBookStore()
const cart = computed(() => store.cart)
</script>

<style scoped>
#books-cart {
    width: 100%;
}
.empty-cart {
    text-align: center;
    margin-top: 2rem;
}
</style>
