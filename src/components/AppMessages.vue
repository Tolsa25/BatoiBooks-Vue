<template>
  <div class="messages">
    <div v-for="(msg, index) in messages" :key="index" :class="['alert', { 'alert-danger': msg.type === 'error', 'alert-info': msg.type === 'info', 'alert-success': msg.type === 'success' }]">
      {{ msg.text }}
      <button @click="store.removeMessage(index)">x</button>
    </div>
  </div>
</template>

<script setup>
import { useBookStore } from '../stores/bookStore'
import { computed } from 'vue'

const store = useBookStore()
const messages = computed(() => store.messages)
</script>

<style scoped>
.messages {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    width: 300px;
}
.alert {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    color: white;
    background-color: #444;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.alert-danger { background-color: #d9534f; }
.alert-info { background-color: #5bc0de; }
.alert-success { background-color: #5cb85c; }
</style>
