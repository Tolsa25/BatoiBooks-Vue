<template>
  <nav>
    <ul>
      <li><RouterLink to="/">BatoiBooks</RouterLink></li>
      <li><RouterLink to="/">Ver Libros</RouterLink></li>
      <li><RouterLink to="/new">Nuevo libro</RouterLink></li>
      <li><a href="#about">Acerca de</a></li>
      <li><RouterLink to="/cart">Ver Carrito</RouterLink></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "AppMenu",
};
</script>
