<template>
  <div class="home">
    <h1>Welcome on a Pokedex App made in VueJS !</h1>
    <h2>
      To start, you can get Pokemon on the Global Pokedex then add them easily to your personal
      Pokedex.
    </h2>
    <div class="buttons_home">
      <RouterLink v-slot="{ navigate, isActive }" to="/pokedex" custom>
        <button @click="navigate" :class="{ active: isActive }">Global Pokedex</button>
      </RouterLink>
      <RouterLink v-slot="{ navigate, isActive }" to="/perso" custom>
        <button @click="navigate" :class="{ active: isActive }">Personal Pokedex</button>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  height: 80vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1em;
  text-align: center;
}

h1,
h2 {
  color: white;
}

h1 {
  font-size: 3em;
  margin-bottom: 0.5em;
}

h2 {
  font-size: 1.8em;
  margin-bottom: 2em;
}

.buttons_home {
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 1em;
  flex-wrap: wrap;
}

button {
  padding: 1.5em 4em;
  background-color: rgb(60, 5, 5);
  color: white;
  border: none;
  border-radius: 15px;
  margin: 10px;
  cursor: pointer;
  font-size: 1.2em;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: rgb(157, 32, 32);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5em;
  }

  h2 {
    font-size: 1.5em;
  }

  .buttons_home {
    flex-direction: column;
    align-items: center;
  }

  button {
    width: 100%;
    padding: 1.2em 3em;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.2em;
  }

  button {
    font-size: 1em;
    padding: 1.5em 2.5em;
  }
}
</style>
