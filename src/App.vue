<template>
  <!-- <div id="nav"> -->
  <!-- <router-link to="/">Home</router-link> | -->
  <!-- <router-link to="/about">About</router-link> -->
  <!-- </div> -->
  <router-view />
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Balsamiq+Sans:wght@400;700&display=swap");

html,
body {
  width: 100cw;
  height: 100vh;
  margin: 0;
}

#app {
  font-family: "Balsamiq Sans", cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ececec;
  background: #161920;
  height: 100%;
  overflow-y: scroll;
  //pattern
  background-color: #050506;
  opacity: 1;
  background-image: radial-gradient(
      #686868d2 0.9500000000000001px,
      transparent 0.9500000000000001px
    ),
    radial-gradient(
      #68686800 0.9500000000000001px,
      #050506 0.9500000000000001px
    );
  background-size: 38px 38px;
  background-position: 0 0, 19px 19px;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
