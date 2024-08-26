<template>
  <div class="container">
    <AppNavbar />
    <form @submit.prevent="deleteCategory">
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete Category #{{ catId }}</h1>
          <h4>Category Name: {{ name }}</h4>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete this category?
          </p>
          <p class="text-danger">
            When deleting this category, it will delete all related menu items
            as well...
          </p>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button class="btn btn-info" @click="goBack">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" type="submit">Delete Now</button>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div
          class="col-auto d-block mx-auto alert alert-success"
          v-if="successMessage"
        >
          {{ successMessage }}
        </div>
        <div
          class="col-auto d-block mx-auto alert alert-warning"
          v-if="errorMessage"
        >
          {{ errorMessage }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import AppNavbar from "@/components/header/AppNavbar.vue";
import axios from "axios";

export default {
  name: "DeleteCategory",
  components: {
    AppNavbar,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      catId: this.$route.params.catId,
      userId: "",
      name: "",
      allItemsIdIs: [],
      successMessage: "",
      errorMessage: "",
    };
  },
  async mounted() {
    const user = JSON.parse(localStorage.getItem("user-info") || "{}");
    if (!user.id) {
      this.$router.push({ name: "SignView" });
      return;
    }
    this.userId = user.id;
    await this.loadCategory();
    await this.loadItems();
    await this.checkUserAccess();
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "ViewCategories",
        params: { locationId: this.locationId },
      });
    },
    async loadCategory() {
      try {
        const { data } = await axios.get(`http://localhost:3000/categories`, {
          params: {
            userId: this.userId,
            locationId: this.locationId,
            id: this.catId,
          },
        });
        if (data.length) {
          this.name = data[0].name;
        }
      } catch (error) {
        this.errorMessage = "Failed to load category.";
      }
    },
    async loadItems() {
      try {
        const { data } = await axios.get(`http://localhost:3000/items`, {
          params: { catId: this.catId },
        });
        this.allItemsIdIs = data.map((item) => item.id);
      } catch (error) {
        this.errorMessage = "Failed to load items.";
      }
    },
    async checkUserAccess() {
      try {
        const { data } = await axios.get(`http://localhost:3000/locations`, {
          params: { id: this.locationId, userId: this.userId },
        });
        if (data.length === 0) {
          this.$router.push({ name: "HomeView" });
        }
      } catch (error) {
        this.errorMessage = "Access check failed.";
      }
    },
    async deleteCategory() {
      try {
        await axios.delete(`http://localhost:3000/categories/${this.catId}`);
        await Promise.all(
          this.allItemsIdIs.map((id) =>
            axios.delete(`http://localhost:3000/items/${id}`)
          )
        );
        this.successMessage = "Category and related items have been deleted.";
        this.errorMessage = "";
        setTimeout(() => {
          this.$router.push({
            name: "ViewCategories",
            params: { locationId: this.locationId },
          });
        }, 2000);
      } catch (error) {
        this.successMessage = "";
        this.errorMessage = "Failed to delete category and items.";
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
