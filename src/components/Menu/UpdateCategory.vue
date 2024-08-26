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
    <div class="row g-3 align-items-center">
      <div class="text-center mb-3">
        <h4 class="mb0">{{ locName }}</h4>
        <p class="text-muted">{{ locAddress }}</p>
      </div>
    </div>
    <form @submit.prevent="updateCategory">
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <h1>Update Category</h1>
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
              placeholder="Category Name Is"
              v-model.trim="name"
            />
            <label for="floatRestCatIs">Category Name Is</label>
            <span class="error-feedback" v-if="v$.name.$error">
              {{ v$.name.$errors[0].$message }}
            </span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center mb-3">
        <div class="col-auto d-block mx-auto">
          <button type="submit" class="w250 btn btn-warning">Update Now</button>
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
          class="col-auto d-block mx-auto alert alert-danger"
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
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";

export default {
  name: "AddNewCategory",
  components: { AppNavbar },
  data() {
    return {
      v$: useVuelidate(),
      locationId: this.$route.params.locationId,
      catId: this.$route.params.catId,
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
  async mounted() {
    const user = JSON.parse(localStorage.getItem("user-info") || "{}");
    if (!user.id) {
      this.$router.push({ name: "SignView" });
      return;
    }

    this.userId = user.id;
    await this.loadCategoryData();
  },
  methods: {
    async loadCategoryData() {
      try {
        // Load location info
        const locationResponse = await axios.get(
          `http://localhost:3000/locations`,
          {
            params: { userId: this.userId, id: this.locationId },
          }
        );
        if (
          locationResponse.status === 200 &&
          locationResponse.data.length > 0
        ) {
          const location = locationResponse.data[0];
          this.locName = location.name;
          this.locAddress = location.address;
        }

        // Load category info
        const categoryResponse = await axios.get(
          `http://localhost:3000/categories`,
          {
            params: {
              userId: this.userId,
              locationId: this.locationId,
              id: this.catId,
            },
          }
        );
        if (
          categoryResponse.status === 200 &&
          categoryResponse.data.length > 0
        ) {
          const category = categoryResponse.data[0];
          this.name = category.name;
        }

        // Load all user categories
        const categoriesResponse = await axios.get(
          `http://localhost:3000/categories`,
          {
            params: { userId: this.userId, locationId: this.locationId },
          }
        );
        if (categoriesResponse.status === 200) {
          this.listOfUserCategories = categoriesResponse.data;
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    },
    async updateCategory() {
      this.v$.$validate();
      if (this.v$.$error) {
        this.errorMessage = "You must fill in category name";
        this.successMessage = "";
        return;
      }

      const categoryExists = this.listOfUserCategories.some(
        (cat) => cat.name.toLowerCase() === this.name.toLowerCase()
      );

      if (categoryExists) {
        this.errorMessage = "Category Name already exists, try another name";
        this.successMessage = "";
        return;
      }

      try {
        const response = await axios.put(
          `http://localhost:3000/categories/${this.catId}`,
          {
            name: this.name,
            userId: this.userId,
            locationId: parseInt(this.locationId, 10),
          }
        );
        if (response.status === 200) {
          this.successMessage = "Update Category Name Successfully";
          this.errorMessage = "";
          setTimeout(() => {
            this.$router.push({
              name: "ViewCategories",
              params: { locationId: this.locationId },
            });
          }, 2000);
        } else {
          this.errorMessage = "Something went wrong, try again..";
          this.successMessage = "";
        }
      } catch (error) {
        this.errorMessage = "Something went wrong, try again..";
        this.successMessage = "";
        console.error("Failed to update category:", error);
      }
    },
  },
};
</script>

<style>
/* Add any required styles here */
</style>
