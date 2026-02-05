<template>
  <div id="app">
    <header class="app-header">
      <h1>🎨 AI 漫剧生成器</h1>
      <p class="subtitle">一句话创意，生成你的专属四格漫画</p>
    </header>

    <main class="app-main">
      <ComicGenerator />
    </main>

    <footer class="app-footer">
      <p>Powered by AI · Made with ❤️</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ComicGenerator from './components/ComicGenerator.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  text-align: center;
  padding: 2rem 1rem;
  color: white;
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.app-main {
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.app-footer {
  text-align: center;
  padding: 1.5rem;
  color: white;
  opacity: 0.8;
}
</style>
