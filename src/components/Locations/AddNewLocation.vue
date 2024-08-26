<template>
  <AppNavbar />
  <div class="container">
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Add New Restaurant</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.name.$error }"
          >
            <input
              type="text"
              class="w250 form-control"
              id="floatRestNameIs"
              placeholder="Restaurant Name Is"
              v-model.trim="state.name"
            />
            <label for="floatRestNameIs">Restaurant Name Is</label>
            <span class="error-feedback" v-if="v$.name.$error">{{
              v$.name.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.phone.$error }"
          >
            <input
              type="text"
              class="w250 form-control"
              id="floatRestPhoneIs"
              placeholder="Restaurant Phone No. Is"
              v-model.trim="state.phone"
            />
            <label for="floatRestPhoneIs">Restaurant Phone No. Is</label>
            <span class="error-feedback" v-if="v$.phone.$error">{{
              v$.phone.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.address.$error }"
          >
            <input
              type="text"
              class="w250 form-control"
              id="floatRestAddressIs"
              placeholder="Restaurant Address Is"
              v-model.trim="state.address"
            />
            <label for="floatRestAddressIs">Restaurant Address Is</label>
            <span class="error-feedback" v-if="v$.address.$error">{{
              v$.address.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="button"
            @click="addLocation"
            class="w250 btn btn-primary"
          >
            Add Now
          </button>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div
          class="col-auto d-block mx-auto alert alert-success"
          v-if="successMessage.length > 0"
        >
          {{ successMessage }}
        </div>
        <div
          class="col-auto d-block mx-auto alert alert-danger"
          v-if="errorMessage.length > 0"
        >
          {{ errorMessage }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import AppNavbar from "@/components/header/AppNavbar.vue";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import axios from "axios";

export default {
  name: "AddNewLocation",
  setup() {
    const state = reactive({
      name: "",
      phone: "",
      address: "",
    });
    const rules = computed(() => {
      return {
        name: { required, minLength: minLength(10) },
        phone: { required, minLength: minLength(10) },
        address: { required, minLength: minLength(10) },
      };
    });
    const v$ = useValidate(rules, state);
    return {
      state,
      v$,
    };
  },
  components: {
    AppNavbar,
  },
  data() {
    return {
      userId: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "SignView" });
    } else {
      this.userId = JSON.parse(user).id;
    }
  },
  methods: {
    async addLocation() {
      this.v$.$validate();
      if (!this.v$.$error) {
        try {
          const results = await axios.post("http://localhost:3000/locations", {
            name: this.state.name,
            phone: this.state.phone,
            address: this.state.address,
            userId: this.userId,
          });

          if (results.status === 201) {
            this.successMessage = "Added New Location Successfully!";
            this.errorMessage = "";
            setTimeout(() => {
              this.$router.push({ name: "HomeView" });
            }, 2000);
          } else {
            this.successMessage = "";
            this.errorMessage = "Failed to add location. Please try again.";
          }
        } catch (error) {
          this.successMessage = "";
          this.errorMessage = "Something went wrong, please try again.";
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "Please fill in all fields correctly!";
      }
    },
  },
};
</script>

<style scoped>
.h400 {
  height: 400px;
}
.error-feedback {
  color: rgb(236, 20, 67);
  font-size: 0.85em;
}
</style>
