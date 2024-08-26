<template>
  <form @click.prevent>
    <div class="row g-3 alin-items-center">
      <h1>Login</h1>
      <h2>welcome</h2>
      <div class="col-auto d-block mx-auto">
        <input
          type="email"
          class="form-control"
          placeholder="Enter Your Email"
          v-model="state.email"
        />
        <span class="error-feedback" v-if="v$.email.$error"
          >{{ v$.email.$errors[0].$message }}
        </span>
      </div>
    </div>
    <br />
    <div class="row g-3 alin-items-center">
      <div class="col-auto d-block mx-auto">
        <input
          type="password"
          class="form-control"
          placeholder="Enter Your Password"
          v-model="state.pass"
        />
        <span class="error-feedback" v-if="v$.pass.$error"
          >{{ v$.pass.$errors[0].$message }}
        </span>
      </div>
    </div>
    <br />
    <div class="row g-3 alin-items-center">
      <div class="col-auto d-block mx-auto">
        <button type="submit" @click="userLogin()" class="btn btn-primary">
          Login
        </button>
        &nbsp; &nbsp;&nbsp;
        <button type="button" @click="SignViewPage()" class="btn btn-primary">
          Sign UP
        </button>
      </div>
    </div>
    <br />
    <div class="row g-3 alin-items-center">
      <div class="col-auto d-block mx-auto error-feedback">
        {{ userNotFoundError }}
      </div>
    </div>
    <br />
  </form>
</template>

<script>
import uesValidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import axios from "axios";
export default {
  name: "LoginForm",
  // compostion Api
  setup() {
    // data
    const state = reactive({
      pass: "",
      email: "",
    });
    // validation اللى هتم
    const rules = computed(() => {
      return {
        pass: { required },
        email: { required, email },
      };
    });

    const v$ = uesValidate(rules, state);
    return {
      state,
      v$,
    };
  },
  data() {
    return {
      userNotFoundError: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user && this.$route.name === "LoginView") {
      this.$router.push({ name: "HomeView" });
    }
  },
  methods: {
    SignViewPage() {
      this.$router.push({ name: "SignView" });
    },
    async userLogin() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("Form validated Successfully");
        // eslint-disable-next-line no-unused-vars
        let result = await axios.get(
          `http://localhost:3000/users?email${this.state.email}=&pass=${this.state.pass}`
        );
        if (result.status == 200 && result.data.length > 0) {
          localStorage.setItem("user-info", JSON.stringify(result.data[0]));
          // this.userNotFoundError = "user Found";
          this.$router.push({ name: "HomeView" });
        } else {
          this.userNotFoundError = "user Not Found";
        }
        // console.log(result);
      } else {
        console.log("Form validated failed");
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
