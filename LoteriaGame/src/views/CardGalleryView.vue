<template>
  <div class="card-gallery-view">
    <CardGallery />
  </div>
</template>

<script setup lang="ts">
import CardGallery from '@/components/CardGallery.vue';
</script>

<style scoped>
.card-gallery-view {
  min-height: 100vh;
  background: var(--gradient-night);
}
</style>