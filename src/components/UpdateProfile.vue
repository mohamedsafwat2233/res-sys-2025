<template>
  <div class="container">
    <AppNavbar />
    <form @submit.prevent="updateProfileNow">
      <div class="row g-3 align-items-center">
        <h1>Update My Profile Info</h1>
        <div class="col-auto d-block mx-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Enter Your Name"
            v-model="name"
          />
          <span class="error-feedback" v-if="v$.name.$error">{{
            v$.name.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="email"
            class="form-control"
            placeholder="Enter Your Email"
            v-model="email"
          />
          <span class="error-feedback" v-if="v$.email.$error">{{
            v$.email.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="password"
            class="form-control"
            placeholder="Enter Your Password"
            v-model="pass"
          />
          <span class="error-feedback" v-if="v$.pass.$error">{{
            v$.pass.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button type="submit" class="btn btn-primary">Update Profile</button>
        </div>
      </div>
      <br />
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { required, email, minLength } from "@vuelidate/validators";
import AppNavbar from "@/components/header/AppNavbar.vue";
import useValidate from "@vuelidate/core";

export default {
  name: "ProfileForm",
  components: {
    AppNavbar,
  },
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      pass: "",
      userId: "",
      userNotFoundErr: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(3) },
      email: { required, email },
      pass: { required, minLength: minLength(6) },
    };
  },
  mounted() {
    const user = localStorage.getItem("user-info");
    if (user) {
      const parsedUser = JSON.parse(user);
      this.name = parsedUser.name;
      this.email = parsedUser.email;
      this.pass = parsedUser.pass;
      this.userId = parsedUser.id;
    } else {
      this.$router.push({ name: "SignView" });
    }
  },
  methods: {
    async updateProfileNow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("Validated");
        //put
        let result = await axios.put(
          `http://localhost:3000/users/${this.userId}`,
          {
            name: this.name,
            email: this.email,
            pass: this.pass,
          }
        );
        console.log(result);
        if (result.status == 200) {
          console.log("Profile Is Updated Successfully");
          localStorage.setItem("user-info", JSON.stringify(result.data));
          this.$router.push({ name: "ProfileView" });
          // this.$router.push({ name: "ProfileView", params: { pageTitle: "Profile Page" }});
        } else {
          console.warn("Profile Is Not Updated");
          this.userNotFoundErr = "Something went wrong, try again!";
        }
      } else {
        this.userNotFoundErr = "Something went wrong, refresh the page!";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.error-feedback {
  color: rgb(236, 20, 67);
  font-size: 0.85em;
}
</style>
