<template>
  <ul id="nav">
    <router-link
      :to="{ name: 'HomeView', params: { pageTitle: 'Home page' } }"
      exact
    >
      <li>Home</li>
    </router-link>

    <a href="#" @click.prevent="logMeOut()">Logout</a>
  </ul>
</template>

<script>
export default {
  name: "AppNavbar",
  methods: {
    logMeOut() {
      localStorage.clear();
      this.$router.push({ name: "LoginView" });
    },
  },
};
</script>

<style lang="scss" scoped>
$fontColor: rgb(27, 221, 27);
$navColor: #2320d6;

ul {
  display: flex;
  justify-content: center;
  list-style: none;
  margin-bottom: 50px;

  li {
    display: inline;
  }

  a {
    text-decoration: none;
    font-weight: bold;
    padding: 10px;
  }
}

.router-link-exact-active a,
ul a:hover {
  color: $navColor;
  box-shadow: 2px 2px 4px 0px $navColor;
}
</style>
