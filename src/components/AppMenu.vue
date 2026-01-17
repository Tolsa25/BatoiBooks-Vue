<template>
  <nav>
    <ul>
      <li><RouterLink to="/">BatoiBooks</RouterLink></li>
      <li><RouterLink to="/">Libros</RouterLink></li>
      <li><a href="#about">Acerca de</a></li>
      <li><RouterLink to="/cart">Carrito</RouterLink></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "AppMenu",
};
</script>
