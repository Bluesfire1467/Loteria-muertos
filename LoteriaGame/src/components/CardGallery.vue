<template>
  <div class="card-gallery">
    <h2 class="gallery-title">Galería de Cartas SVG - Lotería Día de Muertos</h2>
    
    <div class="gallery-grid">
      <div 
        v-for="card in cards" 
        :key="card.id"
        class="card-showcase"
        @click="selectCard(card)"
        :class="{ 'selected': selectedCard?.id === card.id }"
      >
        <CardSvg
          :card-id="card.id"
          :card-name="card.name"
          :size="120"
          :animated="true"
          class="showcase-svg"
        />
        
        <div class="card-info">
          <h3 class="card-name">{{ card.name }}</h3>
          <p class="card-description">"{{ card.description }}"</p>
        </div>
      </div>
    </div>
    
    <!-- Modal de detalles -->
    <div v-if="selectedCard" class="card-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>
        
        <div class="modal-card">
          <CardSvg
            :card-id="selectedCard.id"
            :card-name="selectedCard.name"
            :size="200"
            :animated="true"
            class="modal-svg"
          />
        </div>
        
        <div class="modal-info">
          <h2>{{ selectedCard.name }}</h2>
          <p class="modal-description">"{{ selectedCard.description }}"</p>
          <div v-if="selectedCard.culturalSignificance" class="cultural-info">
            <h3>Significado Cultural</h3>
            <p>{{ selectedCard.culturalSignificance }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CardSvg from './cards/CardSvg.vue';
import { LOTERIA_CARDS } from '@/data/loteriaCards';
import type { LoteriaCard } from '@/types';

const cards = LOTERIA_CARDS;
const selectedCard = ref<LoteriaCard | null>(null);

const selectCard = (card: LoteriaCard) => {
  selectedCard.value = card;
};

const closeModal = () => {
  selectedCard.value = null;
};
</script>

<style scoped>
.card-gallery {
  padding: var(--spacing-xl);
  background: var(--gradient-night);
  min-height: 100vh;
}

.gallery-title {
  text-align: center;
  color: var(--accent-gold);
  font-family: var(--font-family-display);
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-2xl);
  text-shadow: 0 0 10px rgba(255, 211, 63, 0.5);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1400px;
  margin: 0 auto;
}

.card-showcase {
  background: var(--background-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  border: 2px solid var(--border-primary);
  transition: all var(--transition-normal);
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.card-showcase:hover {
  transform: translateY(-4px);
  border-color: var(--border-accent);
  box-shadow: var(--shadow-strong);
}

.card-showcase.selected {
  border-color: var(--accent-gold);
  box-shadow: 0 0 20px rgba(255, 211, 63, 0.4);
}

.showcase-svg {
  width: 100%;
  height: auto;
  margin-bottom: var(--spacing-md);
}

.card-info {
  text-align: center;
}

.card-name {
  color: var(--accent-gold);
  font-family: var(--font-family-display);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-xs);
}

.card-description {
  color: var(--text-secondary);
  font-style: italic;
  font-size: var(--font-size-sm);
  margin: 0;
}

/* Modal */
.card-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-content {
  background: var(--background-card);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  border: 2px solid var(--border-accent);
  backdrop-filter: blur(15px);
}

.close-btn {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-full);
  transition: background-color var(--transition-normal);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-card {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.modal-svg {
  max-width: 250px;
  height: auto;
}

.modal-info h2 {
  color: var(--accent-gold);
  font-family: var(--font-family-display);
  font-size: var(--font-size-2xl);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.modal-description {
  color: var(--text-primary);
  font-style: italic;
  font-size: var(--font-size-lg);
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.cultural-info {
  background: rgba(255, 211, 63, 0.1);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  border-left: 4px solid var(--accent-gold);
}

.cultural-info h3 {
  color: var(--accent-gold);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
}

.cultural-info p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }
  
  .card-gallery {
    padding: var(--spacing-lg);
  }
  
  .gallery-title {
    font-size: var(--font-size-2xl);
  }
  
  .modal-content {
    padding: var(--spacing-lg);
    margin: var(--spacing-md);
  }
  
  .modal-svg {
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--spacing-sm);
  }
  
  .card-showcase {
    padding: var(--spacing-sm);
  }
  
  .card-name {
    font-size: var(--font-size-base);
  }
  
  .card-description {
    font-size: var(--font-size-xs);
  }
}
</style>