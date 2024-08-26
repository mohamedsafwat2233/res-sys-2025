<template>
  <div>
    <br />
    <div class="text-center">
      <router-link :to="{ name: 'HomeView' }">
        <button class="btn btn-info">Visit Home Page</button>
      </router-link>
    </div>
    <br />
    <img
      :src="require('../assets/pageNotFound.jpg')"
      class="rounded mx-auto d-block h400"
    />
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
};
</script>

<style>
.h400 {
  height: 400px;
}
</style>
