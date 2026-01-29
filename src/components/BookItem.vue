<template>
  <div class="cardBook">
    <div class="card-body">
      <div class="card-image" v-if="book.photo">
        <img :src="'/' + book.photo" :alt="book.idModule" />
      </div>
      <p>Libro: {{ book.id }}</p>
      <h3>Módulo: {{ store.getModuleDescription(book.idModule) }}</h3>
      <h4>{{ book.publisher }}</h4>
      <p>{{ book.pages }} páginas</p>
      <p>Estado: {{ book.status }}</p>
      <p v-if="book.soldDate">Vendido el: {{ book.soldDate }}</p>
      <p v-else>No vendido aún</p>
      <p>{{ book.comments }}</p>
      <h3 class="price-tag">{{ book.price }}€</h3>
      
      <div class="card-actions-container">
          <slot name="actions">
              <button @click="store.addToCart(book)" :disabled="store.isInCart(book.id)">
                  <span class="material-icons">{{ store.isInCart(book.id) ? 'done' : 'add_shopping_cart' }}</span>
              </button>
              <button @click="editBook(book)">
                  <span class="material-icons">mode_edit</span>
              </button>
              <button @click="deleteBook">
                  <span class="material-icons">delete</span>
              </button>
          </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useBookStore } from '../stores/bookStore'

const router = useRouter()

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const store = useBookStore()

const editBook = (book) => {
    router.push(`/edit/${book.id}`)
}

const deleteBook = () => {
    store.deleteBook(props.book.id)
}
</script>
