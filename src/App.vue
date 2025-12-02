<script setup>
// rien à importer ici pour le moment
</script>

<template>
  <!-- Layout global -->
  <div class="min-h-screen bg-slate-100 text-gray-900">
    <!-- Le router rend toutes les pages ici -->
    <router-view />
  </div>
</template>

<style>
/* Styles globaux si besoin */
body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
