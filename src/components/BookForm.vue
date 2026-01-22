<template>
  <div id="form-section">
      <h2>Añadir libro</h2>
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
              <button type="submit">Añadir</button>
              <button type="button" @click="resetForm">Reset</button>
          </div>
      </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useBookStore } from '../stores/bookStore'

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

const submitForm = async () => {
    // Generate simple ID if empty (handled by json-server usually but...)
    // json-server auto-generates id if not provided or compatible.
    // We send without ID for new items or string ID?
    // Let's copy payload
    const payload = { ...book }
    delete payload.id // let server handle ID
    
    await store.addBook(payload)
    resetForm()
}

const resetForm = () => {
    Object.assign(book, initialBook)
}

onMounted(() => {
    store.fetchModules()
})
</script>
