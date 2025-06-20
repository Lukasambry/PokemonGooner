<script setup lang="ts">
import { ref } from 'vue'
const menuOpen = ref(false)
function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <nav class="navbar">
    <router-link to="/" class="nav-logo" @click="closeMenu">Pokémon Gooner</router-link>
    <button class="burger" @click="toggleMenu" aria-label="Ouvrir le menu" :aria-expanded="menuOpen">
      <span :class="{ 'open': menuOpen }"></span>
      <span :class="{ 'open': menuOpen }"></span>
      <span :class="{ 'open': menuOpen }"></span>
    </button>
    <div class="nav-links" :class="{ 'open': menuOpen }">
      <router-link to="/" class="nav-item" @click="closeMenu">Accueil</router-link>
      <router-link to="/my-team" class="nav-item" @click="closeMenu">Mon Équipe</router-link>
    </div>
    <div v-if="menuOpen" class="nav-overlay" @click="closeMenu"></div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #e3350d;
  padding: 0.8rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
}

.nav-logo {
  font-weight: bold;
  font-size: 1.5em;
  color: white;
  text-decoration: none;
}

.burger {
  display: none;
  background: none;
  border: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  z-index: 1101;
}
.burger span {
  display: block;
  width: 28px;
  height: 3px;
  background: #fff;
  border-radius: 2px;
  transition: 0.3s;
}
.burger span.open:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.burger span.open:nth-child(2) {
  opacity: 0;
}
.burger span.open:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 1.1em;
  padding: 0.5rem 0;
  position: relative;
}

.nav-item:hover {
  color: #ffcb05;
}

.nav-item.router-link-exact-active {
  font-weight: bold;
}

.nav-item.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ffcb05;
}

/* --- Responsive --- */
@media (max-width: 700px) {
  .burger {
    display: flex;
  }
  .nav-links {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 70vw;
    max-width: 320px;
    background: #e3350d;
    flex-direction: column;
    align-items: flex-start;
    padding: 5rem 2rem 2rem 2rem;
    gap: 2rem;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(.4,2,.6,1);
    z-index: 1100;
    box-shadow: -2px 0 8px rgba(0,0,0,0.08);
    opacity: 0.98;
  }
  .nav-links.open {
    transform: translateX(0);
  }
  .nav-links .nav-item {
    font-size: 1.3em;
    width: 100%;
    padding: 0.7em 0;
  }
  .nav-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.25);
    z-index: 1099;
  }
}
</style>
