<template>
  <AppNavbar />
  <form @click.prevent>
    <div class="row g-3 align-items-center">
      <div class="col-auto d-block mx-auto">
        <h1>Update Restaurant</h1>
        <hr />
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
          <span class="error-feedback" v-if="v$.name.$error">
            {{ v$.name.$errors[0].$message }}
          </span>
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
          <span class="error-feedback" v-if="v$.phone.$error">
            {{ v$.phone.$errors[0].$message }}
          </span>
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
          <span class="error-feedback" v-if="v$.address.$error">
            {{ v$.address.$errors[0].$message }}
          </span>
        </div>
      </div>
    </div>
    <div class="row g-3 align-items-center mb-3">
      <div class="col-auto d-block mx-auto">
        <button
          type="button"
          @click="updateLocation()"
          class="w250 btn btn-warning"
        >
          Update Now
        </button>
      </div>
    </div>
    <div class="row g-3 align-items-center mb-3">
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
</template>

<script>
import AppNavbar from "@/components/header/AppNavbar.vue";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
import { reactive, computed } from "vue";
import axios from "axios";

export default {
  name: "UpdateLocation",
  components: {
    AppNavbar,
  },
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
  data() {
    return {
      locationId: "",
      userId: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  mounted() {
    const user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "SignView" });
    } else {
      this.userId = JSON.parse(user).id;
      this.locationId = this.$route.params.locationId;
      this.canCurrentUserAccessThisLocation();
    }
  },
  methods: {
    async canCurrentUserAccessThisLocation() {
      try {
        const result = await axios.get(
          `http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`
        );
        if (result.status === 200 && result.data.length > 0) {
          const locationData = result.data[0];
          this.state.name = locationData.name;
          this.state.address = locationData.address;
          this.state.phone = locationData.phone;
        } else {
          this.$router.push({ name: "HomeView" });
        }
      } catch (error) {
        this.$router.push({ name: "HomeView" });
      }
    },
    async updateLocation() {
      this.v$.$validate(); //activate my validations
      if (!this.v$.$error) {
        try {
          const results = await axios.put(
            `http://localhost:3000/locations/${this.locationId}`,
            {
              name: this.state.name,
              phone: this.state.phone,
              address: this.state.address,
              userId: this.userId,
            }
          );
          if (results.status === 200) {
            this.errorMessage = "";
            this.successMessage = "Location updated successfully!";
            setTimeout(() => {
              this.$router.push({ name: "HomeView" });
            }, 2000);
          } else {
            this.successMessage = "";
            this.errorMessage =
              "Failed to update the location. Please try again!";
          }
        } catch (error) {
          this.successMessage = "";
          this.errorMessage = "Something went wrong. Please try again!";
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "Please fill in all required fields!";
      }
    },
  },
};
</script>

<style scoped>
.error-feedback {
  color: #ec1443;
  font-size: 0.85em;
}
</style>
