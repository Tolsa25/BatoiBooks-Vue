<template>
  <div class="content-wrapper">
       <div class="main-column">
          <BookForm />
       </div>
  </div>
</template>

<script setup>
import BookForm from '../components/BookForm.vue'
</script>

<style scoped>
.content-wrapper {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.main-column {
  width: 100%;
}
</style>
