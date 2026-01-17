import { defineStore } from 'pinia'
import api from '../services/api'

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        books: [],
        cart: [],
        messages: []
    }),
    getters: {
        totalBooks: (state) => state.books.length,
        totalPrice: (state) => state.books.reduce((total, book) => total + book.price, 0).toFixed(2)
    },
    actions: {
        async fetchBooks() {
            try {
                const response = await api.get('/books')
                this.books = response.data
            } catch (error) {
                this.addMessage('Error al recuperar los libros: ' + error.message, 'error')
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
            this.cart.push(book)
            this.addMessage('Libro añadido al carrito', 'info')
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
