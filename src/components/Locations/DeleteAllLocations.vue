<template>
  <div class="container">
    <AppNavbar />
    <form @submit.prevent="deleteAllLocation">
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete All Locations</h1>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete all locations?
          </p>
          <p class="text-danger">
            It will also delete all related items and categories... Be careful!
          </p>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button class="btn btn-info" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" type="submit">Delete All</button>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div
          class="col-auto d-block mx-auto alert alert-warning"
          v-if="successMessage.length > 0"
        >
          {{ successMessage }}
        </div>
        <div
          class="col-auto d-block mx-auto alert alert-success"
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
import axios from "axios";

export default {
  name: "DeleteAllLocations",
  components: {
    AppNavbar,
  },
  data() {
    return {
      userId: "",
      successMessage: "",
      errorMessage: "",
      allLocationId: [],
      allItemsIdIs: [],
      allCatsIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "Signup" });
    } else {
      this.userId = JSON.parse(user).id;
      await this.fetchLocations();
      await this.fetchCategories();
      await this.fetchItems();
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: "Home" });
    },
    async fetchLocations() {
      try {
        const resultLoc = await axios.get(
          `http://localhost:3000/locations?userId=${this.userId}`
        );
        this.allLocationId = resultLoc.data.map((location) => location.id);
      } catch (error) {
        this.errorMessage = "Failed to fetch locations.";
      }
    },
    async fetchCategories() {
      try {
        const resultCatLoc = await axios.get(
          `http://localhost:3000/categories?userId=${this.userId}`
        );
        this.allCatsIdIs = resultCatLoc.data.map((cat) => cat.id);
      } catch (error) {
        this.errorMessage = "Failed to fetch categories.";
      }
    },
    async fetchItems() {
      try {
        const resultItemsLoc = await axios.get(
          `http://localhost:3000/items?userId=${this.userId}`
        );
        this.allItemsIdIs = resultItemsLoc.data.map((item) => item.id);
      } catch (error) {
        this.errorMessage = "Failed to fetch items.";
      }
    },
    async deleteAllLocation() {
      try {
        // Delete items, categories, and locations in parallel
        const deleteRequests = [
          ...this.allItemsIdIs.map((id) =>
            axios.delete(`http://localhost:3000/items/${id}`)
          ),
          ...this.allCatsIdIs.map((id) =>
            axios.delete(`http://localhost:3000/categories/${id}`)
          ),
          ...this.allLocationId.map((id) =>
            axios.delete(`http://localhost:3000/locations/${id}`)
          ),
        ];

        const results = await Promise.all(deleteRequests);

        if (results.every((response) => response.status === 200)) {
          this.successMessage =
            "All locations, items, and categories have been deleted.";
          this.errorMessage = "";
          setTimeout(() => {
            this.$router.push({ name: "Home" });
          }, 2000);
        } else {
          this.successMessage = "";
          this.errorMessage = "Something went wrong. Please try again.";
        }
      } catch (error) {
        this.successMessage = "";
        this.errorMessage = "An error occurred. Please try again!";
      }
    },
  },
};
</script>

<style scoped>
.text-danger {
  color: red;
}
.alert-success {
  color: green;
}
.alert-warning {
  color: orange;
}
</style>
