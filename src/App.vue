<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="app-container">
    <NavBar />
    
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Transition name="fade" mode="out-in">
            <KeepAlive>
              <component :is="Component" />
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>
    </main>

    <footer class="app-footer">
      <p>&copy; {{ new Date().getFullYear() }} P0k3G00n3r</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #181818;
}

.main-content {
  flex: 1;
  padding: 20px;
  margin-top: 60px;
  margin-bottom: 60px;
}

.app-footer {
  text-align: center;
  padding: 1rem;
  background-color: #333;
  color: #f0f0f0;
  font-size: 0.9em;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
