<template>
  <div class="cardBook">
    <div class="card-body">
      <p>Libro: {{ book.id }}</p>
      <h3>{{ book.title }} ({{ book.id }})</h3>
      <h4>{{ book.publisher }}</h4>
      <p>{{ book.pages }} páginas</p>
      <p>Estado: {{ book.status }}</p>
      <p>No vendido aún</p>
      <p>{{ book.comments }}</p>
      <h3>{{ book.price }}€</h3>
      
      <div class="card-actions-container">
          <button @click="store.addToCart(book)">
              <span class="material-icons">add_shopping_cart</span>
          </button>
          <button @click="editBook(book)">
              <span class="material-icons">mode_edit</span>
          </button>
          <button @click="deleteBook">
              <span class="material-icons">delete</span>
          </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBookStore } from '../stores/bookStore'

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const store = useBookStore()

const editBook = (book) => {
    store.addMessage("Funcionalidad de edición no implementada todavía", "info")
}
const deleteBook = () => {
    store.deleteBook(props.book.id)
}
</script>
