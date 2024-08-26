<template>
  <form @submit.prevent="SignUpNow">
    <div class="row g-3 align-items-center">
      <h1>Sign Up</h1>
      <h2>Welcome</h2>
      <div class="col-auto d-block mx-auto">
        <input
          type="text"
          class="form-control"
          placeholder="Enter Your Name"
          v-model="name"
        />
        <span class="error-feedback" v-if="v$.name.$error">
          {{ v$.name.$errors[0].$message }}
        </span>
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
        <span class="error-feedback" v-if="v$.email.$error">
          {{ v$.email.$errors[0].$message }}
        </span>
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
        <span class="error-feedback" v-if="v$.pass.$error">
          {{ v$.pass.$errors[0].$message }}
        </span>
      </div>
    </div>
    <br />
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <button type="submit" class="btn btn-primary">Sign Up Now</button>
        |
        <button type="button" @click="LoginViewPage()" class="btn btn-primary">
          Login
        </button>
      </div>
    </div>
    <br />
  </form>
</template>

<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

export default {
  name: "SignUpForm",
  data() {
    return {
      v$: useVuelidate(), // تصحيح الاسم
      name: "",
      pass: "",
      email: "",
    };
  },
  validations() {
    return {
      name: { required },
      pass: { required, minLength: minLength(6) }, // إضافة minLength للتحقق من صحة كلمة المرور
      email: { required, email },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user && this.$route.name === "SignView") {
      this.$router.push({ name: "HomeView" });
    }
  },
  methods: {
    LoginViewPage() {
      this.$router.push({ name: "LoginView" });
    },
    async SignUpNow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("Form validated Successfully");
        try {
          let result = await axios.post("http://localhost:3000/users", {
            name: this.name,
            email: this.email,
            pass: this.pass,
          });
          if (result.status === 201) {
            console.log("Added New User Successfully");
            localStorage.setItem("user-info", JSON.stringify(result.data));
            this.$router.push({ name: "HomeView" });
          } else {
            console.log("Error adding new user");
          }
        } catch (error) {
          console.error("Error during sign-up:", error);
        }
      } else {
        console.log("Form validation failed");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.error-feedback {
  color: red;
  font-size: 0.85em;
}
</style>
