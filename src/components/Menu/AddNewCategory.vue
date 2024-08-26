<template>
  <AppNavbar />
  <div class="container">
    <router-link
      :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
    >
      <button class="btn btn-info">Back to Category</button>
    </router-link>
    &nbsp;&nbsp;
    <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
      <button class="btn btn-success">Back to Menu</button>
    </router-link>
    <br />
    <div class="clearfix"></div>
    <div class="text-center">
      <h4 class="mb0">{{ locName }}</h4>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
    <br />
    <form @submit.prevent="addCategory">
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Add New Category</h1>
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
              id="floatRestCatIs"
              placeholder="Category Name"
              v-model.trim="name"
            />
            <label for="floatRestCatIs">Category Name</label>
            <span class="error-feedback" v-if="v$.name.$error">
              {{ v$.name.$errors[0].$message }}
            </span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center mb-3">
        <div class="col-auto d-block mx-auto">
          <button type="submit" class="w250 btn btn-success">Add Now</button>
        </div>
      </div>
      <div class="row g-3 align-items-center mb-3">
        <div
          class="col-auto d-block mx-auto alert alert-success"
          v-if="successMessage"
        >
          {{ successMessage }}
        </div>
        <div
          class="col-auto d-block mx-auto alert alert-danger mb-3"
          v-if="errorMessage"
        >
          {{ errorMessage }}
        </div>
      </div>
      <br />
    </form>
  </div>
</template>

<script>
import AppNavbar from "@/components/header/AppNavbar.vue";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
  name: "AddNewCategory",
  components: {
    AppNavbar,
  },
  data() {
    return {
      v$: useValidate(),
      locationId: this.$route.params.locationId,
      userId: "",
      locName: "",
      locAddress: "",
      name: "",
      successMessage: "",
      errorMessage: "",
      listOfUserCategories: [],
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(3), maxLength: maxLength(15) },
    };
  },
  mounted() {
    const user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "SignView" });
    } else {
      const userData = JSON.parse(user);
      this.userId = userData.id;
      this.getLocationInfo();
      this.displayUserCategories();
    }
  },
  methods: {
    async displayUserCategories() {
      try {
        const result = await axios.get(
          `http://localhost:3000/categories?userId=${this.userId}&locationId=${this.locationId}`
        );
        this.listOfUserCategories = result.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    async getLocationInfo() {
      try {
        const result = await axios.get(
          `http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`
        );
        const locDetails = result.data[0];
        this.locName = locDetails.name;
        this.locAddress = locDetails.address;
      } catch (error) {
        console.error("Error fetching location info:", error);
      }
    },
    async addCategory() {
      this.v$.$validate();
      if (!this.v$.$error) {
        const filterCategoryName = this.listOfUserCategories.filter(
          (v) => v.name.toLocaleLowerCase() === this.name.toLocaleLowerCase()
        );
        if (filterCategoryName.length > 0) {
          this.errorMessage = "Category Name already exists, try another name";
          this.successMessage = "";
        } else {
          try {
            const result = await axios.post(
              `http://localhost:3000/categories`,
              {
                name: this.name,
                userId: this.userId,
                locationId: parseInt(this.locationId, 10),
              }
            );
            if (result.status === 201) {
              this.errorMessage = "";
              this.successMessage = "Added New Category Successfully";
              setTimeout(() => {
                this.$router.push({
                  name: "ViewCategories",
                  params: { locationId: this.locationId },
                });
              }, 2000);
            }
          } catch (error) {
            this.successMessage = "";
            this.errorMessage = "Something went wrong, try again..";
            console.error("Error adding category:", error);
          }
        }
      } else {
        this.successMessage = "";
        this.errorMessage = "You must fill in category name";
      }
    },
  },
};
</script>

<style></style>
