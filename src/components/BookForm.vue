<template>
  <div id="form-section">
      <h2>{{ formTitle }}</h2>
      <form id="addBookForm" @submit.prevent="submitForm">
          <div class="form-group hidden-id-group">
              <label for="id">ID:</label>
              <input type="text" id="id" v-model="book.id" disabled>
          </div>

          <div class="form-group">
              <label for="module">Módulo:</label>
              <select id="module" v-model="book.idModule" required>
                  <option value="" disabled>Selecciona un módulo</option>
                  <option v-for="mod in store.sortedModules" :key="mod.code" :value="mod.code">
                      {{ mod.cliteral }} ({{ mod.code }})
                  </option>
              </select>
          </div>

          <div class="form-group">
            <label for="publisher">Editorial:</label>
            <input type="text" id="publisher" v-model="book.publisher">
          </div>

          <div class="form-group">
              <label for="price">Precio:</label>
              <input type="number" id="price" v-model.number="book.price" step="0.01" required>
          </div>

          <div class="form-group">
              <label for="pages">Páginas:</label>
              <input type="number" id="pages" v-model.number="book.pages">
          </div>

          <div class="form-group radio-group">
              <label>Estado:</label>
              <div class="radio-options">
                  <span class="radio-item">
                      <input type="radio" id="new" value="new" v-model="book.status">
                      <label for="new">Nuevo</label>
                  </span>
                  
                  <span class="radio-item">
                      <input type="radio" id="good" value="good" v-model="book.status">
                      <label for="good">Bueno</label>
                  </span>
                  
                  <span class="radio-item">
                      <input type="radio" id="bad" value="bad" v-model="book.status">
                      <label for="bad">Malo</label>
                  </span>
                  
                  <span class="radio-item">
                      <input type="radio" id="digital" value="digital" v-model="book.status">
                      <label for="digital">Digital</label>
                  </span>
              </div>
          </div>

           <div class="form-group full-width-group">
              <label for="comments">Comentarios:</label>
              <textarea id="comments" v-model="book.comments"></textarea>
          </div>

          <!-- Hidden visible fields for Title/Author as they are required but not in screenshot focus -->
          <div class="form-group">
              <label for="title">Título:</label>
              <input type="text" id="title" v-model="book.title" required>
          </div>
          <div class="form-group">
              <label for="author">Autor:</label>
              <input type="text" id="author" v-model="book.author" required>
          </div>
          
          <!-- Hidden cover field as per implicit request to match fields -->
          <div class="form-group hidden-id-group">
              <label for="cover">Url Portada:</label>
              <input type="text" id="cover" v-model="book.cover">
          </div>
          
           <div class="form-actions">
              <button type="submit">{{ submitButtonText }}</button>
              <button type="button" @click="resetForm">Reset</button>
          </div>
      </form>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '../stores/bookStore'

const route = useRoute()
const router = useRouter()
const store = useBookStore()

const initialBook = {
    id: '',
    title: '',
    author: '',
    publisher: '',
    price: 0,
    pages: 0,
    status: 'new',
    idModule: '',
    comments: '',
    cover: ''
}

const book = reactive({ ...initialBook })
const originalBook = reactive({ ...initialBook })

// Computed property para saber si estamos editando
const isEditing = computed(() => !!route.params.id)

// Computed property para el título del formulario
const formTitle = computed(() => isEditing.value ? 'Editar libro' : 'Añadir libro')

// Computed property para el texto del botón
const submitButtonText = computed(() => isEditing.value ? 'Actualizar' : 'Añadir')

// Función para cargar el libro si estamos editando
const loadBook = () => {
    if (route.params.id) {
        const bookToEdit = store.getBookById(route.params.id)
        if (bookToEdit) {
            Object.assign(book, bookToEdit)
            Object.assign(originalBook, bookToEdit)
        }
    }
}

const submitForm = async () => {
    const payload = { ...book }
    
    if (isEditing.value) {
        // Actualizar libro existente
        await store.updateBook(book.id, payload)
    } else {
        // Añadir nuevo libro
        delete payload.id // let server handle ID
        await store.addBook(payload)
    }
    
    // Navegar a la lista de libros después de guardar
    router.push('/')
}

const resetForm = () => {
    if (isEditing.value) {
        // Si estamos editando, recargar los datos originales
        Object.assign(book, originalBook)
    } else {
        // Si estamos añadiendo, limpiar el formulario a sus valores por defecto
        book.id = ''
        book.title = ''
        book.author = ''
        book.publisher = ''
        book.price = 0
        book.pages = 0
        book.status = 'new'
        book.idModule = ''
        book.comments = ''
        book.cover = ''
    }
}

// Watch para detectar cambios en la ruta
watch(() => route.params.id, () => {
    if (route.params.id) {
        loadBook()
    } else {
        Object.assign(book, initialBook)
        Object.assign(originalBook, initialBook)
    }
}, { immediate: true })

onMounted(() => {
    store.fetchModules()
    store.fetchBooks() // Necesario para tener los libros disponibles
})
</script>
