<template>
  <div class="container">
    <AppNavbar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete All Categories</h1>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete All Categories for This Location?
          </p>
          <br />
          <div class="text-center">
            <h1 class="mb0">{{ locName }}</h1>
            <p class="text-muted">{{ locAddress }}</p>
          </div>
          <p class="text-danger">
            When Deleting all categories, their related menu items will be
            deleted as well...
          </p>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button class="btn btn-info" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteAllCategories()">
            Delete Now
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
          class="col-auto d-block mx-auto alert alert-warning"
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
  name: "DeleteAllCategories",
  components: {
    AppNavbar,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      userId: "",
      locationData: [],
      successMessage: "",
      errorMessage: "",
      allItemsIdIs: [],
      allCatsIdIs: [],
      locName: "",
      locAddress: "",
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "Signup" });
    } else {
      this.userId = JSON.parse(user).id;
      await this.getLocationInfo(this.userId, this.locationId);
      await this.loadItemsAndCategories();
    }
  },
  methods: {
    async loadItemsAndCategories() {
      try {
        let itemsResult = await axios.get(
          `http://localhost:3000/items?locId=${this.locationId}`
        );
        this.allItemsIdIs = itemsResult.data.map((item) => item.id);

        let categoriesResult = await axios.get(
          `http://localhost:3000/categories?locationId=${this.locationId}`
        );
        this.allCatsIdIs = categoriesResult.data.map((cat) => cat.id);
      } catch (error) {
        this.errorMessage = "Error loading data.";
      }
    },
    goBack() {
      this.$router.push({
        name: "ViewCategories",
        params: { locationId: this.locationId },
      });
    },
    async getLocationInfo(userId, locId) {
      try {
        let result = await axios.get(
          `http://localhost:3000/locations?userId=${userId}&id=${locId}`
        );
        if (result.status === 200 && result.data.length > 0) {
          let locDetails = result.data[0];
          this.locName = locDetails.name;
          this.locAddress = locDetails.address;
        }
      } catch (error) {
        this.errorMessage = "Error fetching location info.";
      }
    },
    async deleteAllCategories() {
      try {
        let deleteResults = await Promise.all([
          ...this.allCatsIdIs.map((id) =>
            axios.delete(`http://localhost:3000/categories/${id}`)
          ),
          ...this.allItemsIdIs.map((id) =>
            axios.delete(`http://localhost:3000/items/${id}`)
          ),
        ]);

        if (deleteResults.every((res) => res.status === 200)) {
          this.successMessage =
            "All categories and related items have been deleted.";
          setTimeout(() => {
            this.$router.push({ name: "HomeView" });
          }, 2000);
        } else {
          this.errorMessage = "Error deleting categories or items.";
        }
      } catch (error) {
        this.errorMessage = "Something went wrong. Please try again.";
      }
    },
  },
};
</script>

<style scoped></style>
