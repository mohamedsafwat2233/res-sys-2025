<template>
  <div class="container">
    <AppNavbar />
    <form @submit.prevent="updateProfile">
      <div class="row g-3 align-items-center">
        <h1>Update My Profile Info</h1>
        <!-- <h2>Welcome</h2> -->
        <div class="col-auto d-block mx-auto">
          <input
            type="text"
            class="form-control"
            disabled
            placeholder="Enter Your Name"
            v-model="name"
          />
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            disabled
            type="email"
            class="form-control"
            placeholder="Enter Your Email"
            v-model="email"
          />
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            disabled
            type="password"
            class="form-control"
            placeholder="Enter Your Password"
            v-model="pass"
          />
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="button"
            @click="updateProfile()"
            class="btn btn-primary"
          >
            Update My Profile Info
          </button>
        </div>
      </div>
      <br />
    </form>
  </div>
</template>

<script>
import AppNavbar from "@/components/header/AppNavbar.vue";
export default {
  name: "ProfileForm",
  components: {
    AppNavbar,
  },
  data() {
    return {
      name: "",
      email: "",
      pass: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      const parsedUser = JSON.parse(user); // قم بتحليل البيانات مرة واحدة
      this.name = parsedUser.name;
      this.email = parsedUser.email;
      this.pass = parsedUser.pass;
    } else {
      // استخدام Vue Router لتوجيه المستخدم
      this.$router.push({ name: "SignView" });
    }
  },
  methods: {
    updateProfile() {
      this.$router.push({ name: "UpdateProfile" });
    },
  },
};
</script>

<style></style>
