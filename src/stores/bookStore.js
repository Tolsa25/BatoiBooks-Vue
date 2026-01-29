import { defineStore } from 'pinia'
import api from '../services/api'

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        books: [],
        modules: [],
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        messages: []
    }),
    getters: {
        totalBooks: (state) => state.books.length,
        totalPrice: (state) => state.books.reduce((total, book) => total + book.price, 0).toFixed(2),
        sortedModules: (state) => [...state.modules].sort((a, b) => a.cliteral.localeCompare(b.cliteral)),
        getBookById: (state) => (id) => state.books.find(book => book.id == id),
        getModuleDescription: (state) => (code) => {
            const mod = state.modules.find(m => m.code === code)
            return mod ? mod.cliteral : code
        },
        isInCart: (state) => (bookId) => {
            return !!state.cart.find(b => b.id === bookId)
        }
    },
    actions: {
        async fetchBooks() {
            if (this.books.length > 0) return
            try {
                const response = await api.get('/books')
                this.books = response.data
            } catch (error) {
                this.addMessage('Error al recuperar los libros: ' + error.message, 'error')
            }
        },
        async fetchModules() {
            if (this.modules.length > 0) return
            try {
                const response = await api.get('/modules')
                this.modules = response.data
            } catch (error) {
                this.addMessage('Error al recuperar los módulos: ' + error.message, 'error')
            }
        },
        async addBook(book) {
            try {
                const response = await api.post('/books', book)
                this.books.push(response.data)
                this.addMessage('Libro añadido correctamente', 'success')
            } catch (error) {
                this.addMessage('Error al añadir el libro: ' + error.message, 'error')
            }
        },
        async updateBook(id, book) {
            try {
                const response = await api.put(`/books/${id}`, book)
                const index = this.books.findIndex(b => b.id == id)
                if (index !== -1) {
                    this.books[index] = response.data
                }
                this.addMessage('Libro actualizado correctamente', 'success')
            } catch (error) {
                this.addMessage('Error al actualizar el libro: ' + error.message, 'error')
            }
        },
        async deleteBook(id) {
            try {
                await api.delete(`/books/${id}`)
                this.books = this.books.filter(b => b.id !== id)
                this.addMessage('Libro borrado correctamente', 'success')
            } catch (error) {
                this.addMessage('Error al borrar el libro: ' + error.message, 'error')
            }
        },
        addToCart(book) {
            if (!this.cart.find(b => b.id === book.id)) {
                this.cart.push(book)
                localStorage.setItem('cart', JSON.stringify(this.cart))
                this.addMessage('Libro añadido al carrito', 'info')
            }
        },
        removeFromCart(bookId) {
            this.cart = this.cart.filter(b => b.id !== bookId)
            localStorage.setItem('cart', JSON.stringify(this.cart))
            this.addMessage('Libro eliminado del carrito', 'info')
        },
        addMessage(text, type = 'info') {
            this.messages.push({ text, type, id: Date.now() })
            setTimeout(() => {
                this.removeMessage(0) // Remove the oldest message after 3 seconds (?) - Or maybe just remove by id? 
                // Better logic: remove specific message
            }, 3000)
        },
        removeMessage(index) {
            if (index >= 0 && index < this.messages.length)
                this.messages.splice(index, 1)
        }
    }
})
