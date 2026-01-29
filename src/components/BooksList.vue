<template>
  <div id="books-list">
    <h1>Lista de Libros</h1>
    <div id="list">
       <BookItem v-for="book in books" :key="book.id" :book="book" />
    </div>
    <div v-if="!books.length">No books availables</div>
    <div v-else class="totals">
        <p>Total de libros: {{ totalBooks }}</p>
        <p>Importe total: {{ totalPrice }}€</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useBookStore } from '../stores/bookStore'
import BookItem from './BookItem.vue'

const store = useBookStore()
const books = computed(() => store.books)
const totalBooks = computed(() => store.totalBooks)
const totalPrice = computed(() => store.totalPrice)

onMounted(() => {
  store.fetchBooks()
  store.fetchModules()
})
</script>
