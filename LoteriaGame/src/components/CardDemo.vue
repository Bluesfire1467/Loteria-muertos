<template>
  <div class="card-demo">
    <h2>Demostración de Cartas SVG</h2>
    
    <div class="demo-section">
      <h3>Cartas Principales</h3>
      <div class="cards-row">
        <CardSvg :card-id="1" card-name="La Muerte" :size="120" :animated="true" />
        <CardSvg :card-id="2" card-name="El Corazón" :size="120" :animated="true" />
        <CardSvg :card-id="3" card-name="La Rosa" :size="120" :animated="true" />
        <CardSvg :card-id="4" card-name="El Sol" :size="120" :animated="true" />
        <CardSvg :card-id="5" card-name="La Luna" :size="120" :animated="true" />
      </div>
    </div>
    
    <div class="demo-section">
      <h3>Estados de las Cartas</h3>
      <div class="cards-row">
        <div class="card-state">
          <CardSvg :card-id="8" card-name="La Calavera" :size="100" :animated="true" />
          <p>Normal</p>
        </div>
        <div class="card-state">
          <CardSvg :card-id="8" card-name="La Calavera" :size="100" :is-current="true" :animated="true" />
          <p>Carta Actual</p>
        </div>
        <div class="card-state">
          <CardSvg :card-id="8" card-name="La Calavera" :size="100" :is-marked="true" :animated="true" />
          <p>Marcada</p>
        </div>
      </div>
    </div>
    
    <div class="demo-section">
      <h3>Tamaños</h3>
      <div class="cards-row">
        <CardSvg :card-id="1" card-name="La Muerte" :size="60" :animated="true" />
        <CardSvg :card-id="1" card-name="La Muerte" :size="80" :animated="true" />
        <CardSvg :card-id="1" card-name="La Muerte" :size="100" :animated="true" />
        <CardSvg :card-id="1" card-name="La Muerte" :size="120" :animated="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardSvg from './cards/CardSvg.vue';
</script>

<style scoped>
.card-demo {
  padding: var(--spacing-xl);
  background: var(--gradient-night);
  min-height: 100vh;
  color: var(--text-light);
}

.card-demo h2 {
  text-align: center;
  color: var(--accent-gold);
  font-family: var(--font-family-display);
  margin-bottom: var(--spacing-2xl);
}

.demo-section {
  margin-bottom: var(--spacing-2xl);
}

.demo-section h3 {
  color: var(--primary-orange);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.cards-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.card-state {
  text-align: center;
}

.card-state p {
  margin-top: var(--spacing-sm);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

@media (max-width: 768px) {
  .cards-row {
    gap: var(--spacing-md);
  }
  
  .card-demo {
    padding: var(--spacing-lg);
  }
}
</style>