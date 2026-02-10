<template>
  <div id="form-section">
      <h2>{{ formTitle }}</h2>
      <Form id="addBookForm" @submit="submitForm" :validation-schema="validationSchema">
          <div class="form-group hidden-id-group">
              <label for="id">ID:</label>
              <Field name="id" type="text" v-model="book.id" disabled />
          </div>

          <div class="form-group">
              <label for="idModule">Módulo:</label>
              <Field name="idModule" as="select" v-model="book.idModule">
                  <option value="" disabled>Selecciona un módulo</option>
                  <option v-for="mod in store.sortedModules" :key="mod.code" :value="mod.code">
                      {{ mod.cliteral }} ({{ mod.code }})
                  </option>
              </Field>
              <ErrorMessage name="idModule" class="error-message" />
          </div>

          <div class="form-group">
            <label for="publisher">Editorial:</label>
            <Field name="publisher" type="text" v-model="book.publisher" />
            <ErrorMessage name="publisher" class="error-message" />
          </div>

          <div class="form-group">
              <label for="price">Precio:</label>
              <Field name="price" type="number" v-model.number="book.price" step="0.01" />
              <ErrorMessage name="price" class="error-message" />
          </div>

          <div class="form-group">
              <label for="pages">Páginas:</label>
              <Field name="pages" type="number" v-model.number="book.pages" />
              <ErrorMessage name="pages" class="error-message" />
          </div>

          <div class="form-group radio-group">
              <label>Estado:</label>
              <div class="radio-options">
                  <span class="radio-item">
                      <Field name="status" type="radio" value="new" v-model="book.status" />
                      <label for="new">Nuevo</label>
                  </span>
                  
                  <span class="radio-item">
                      <Field name="status" type="radio" value="good" v-model="book.status" />
                      <label for="good">Bueno</label>
                  </span>
                  
                  <span class="radio-item">
                      <Field name="status" type="radio" value="bad" v-model="book.status" />
                      <label for="bad">Malo</label>
                  </span>
                  
                  <span class="radio-item">
                      <Field name="status" type="radio" value="digital" v-model="book.status" />
                      <label for="digital">Digital</label>
                  </span>
              </div>
              <ErrorMessage name="status" class="error-message" />
          </div>

           <div class="form-group full-width-group">
              <label for="comments">Comentarios:</label>
              <Field name="comments" as="textarea" v-model="book.comments" />
          </div>

          <!-- Hidden visible fields for Title/Author as they are required but not in screenshot focus -->
          <div class="form-group">
              <label for="title">Título:</label>
              <Field name="title" type="text" v-model="book.title" />
              <ErrorMessage name="title" class="error-message" />
          </div>
          <div class="form-group">
              <label for="author">Autor:</label>
              <Field name="author" type="text" v-model="book.author" />
              <ErrorMessage name="author" class="error-message" />
          </div>
          
          <!-- Hidden cover field as per implicit request to match fields -->
          <div class="form-group hidden-id-group">
              <label for="cover">Url Portada:</label>
              <Field name="cover" type="text" v-model="book.cover" />
          </div>
          
           <div class="form-actions">
              <button type="submit">{{ submitButtonText }}</button>
              <button type="button" @click="resetForm">Reset</button>
          </div>
      </Form>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '../stores/bookStore'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

const route = useRoute()
const router = useRouter()
const store = useBookStore()

// Validación con Yup
const validationSchema = yup.object({
    idModule: yup.string().required('El módulo es obligatorio'),
    publisher: yup.string().required('La editorial es obligatoria'),
    price: yup.number()
        .typeError('El precio debe ser un número')
        .required('El precio es obligatorio')
        .min(0, 'El precio debe ser mayor o igual que 0')
        .test('decimal', 'El precio puede tener hasta 2 decimales', (value) => {
            if (value === undefined || value === null) return true
            const regex = /^\d+(\.\d{1,2})?$/
            return regex.test(value.toString())
        }),
    pages: yup.number()
        .typeError('Las páginas deben ser un número')
        .required('Las páginas son obligatorias')
        .integer('Las páginas deben ser un número entero')
        .min(0, 'Las páginas deben ser mayor o igual que 0'),
    status: yup.string().required('El estado es obligatorio'),
    title: yup.string().required('El título es obligatorio'),
    author: yup.string().required('El autor es obligatorio')
})

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

const submitForm = async (values, { setErrors }) => {
    const payload = { ...values }
    
    // Validación de libro duplicado solo para nuevos libros
    if (!isEditing.value) {
        const isDuplicate = store.books.some(existingBook => 
            existingBook.title === payload.title && 
            existingBook.author === payload.author &&
            existingBook.publisher === payload.publisher &&
            existingBook.idModule === payload.idModule
        )
        
        if (isDuplicate) {
            store.addMessage('Este libro ya existe en la base de datos', 'error')
            return
        }
    }
    
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
