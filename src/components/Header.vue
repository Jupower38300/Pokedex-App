<template>
  <header>
    <RouterLink to="/">
      <img
        src="https://pokedream.fr/cdn/shop/files/logo_pokemon_FR.png?v=1734449470&width=3200"
        alt="logo"
        aria-label="Home Page"
      />
    </RouterLink>
    <nav>
      <RouterLink to="/pokedex">Global Pokedex</RouterLink>
      <RouterLink to="/perso">Personal Pokedex</RouterLink>
    </nav>
  </header>
</template>

<script setup></script>

<style scoped>
header {
  width: 100%;
  height: 7em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgb(157, 32, 32);
  padding: 0 2em;
  border-radius: 0px 0px 20px 20px;
  z-index: 3;
}

header img {
  width: 70%;
  max-width: 200px;
}

nav {
  color: white;
  font-size: 17px;
  display: flex;
  gap: 1em;
}

@media (max-width: 768px) {
  header {
    flex-direction: column;
    height: auto;
    padding: 1em;
    text-align: center;
  }

  header img {
    width: 40%;
  }

  nav {
    width: 100%;
    justify-content: center;
    margin-top: 0.5em;
  }
}

@media (max-width: 480px) {
  header img {
    width: 50%;
  }

  nav {
    flex-direction: column;
    gap: 0.5em;
  }
}
</style>
