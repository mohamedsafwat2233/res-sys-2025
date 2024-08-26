<template>
  <div class="container">
    <AppNavbar />
    <form @submit.prevent="deleteAllItems">
      <div class="clearfix"></div>
      <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
        <button type="button" class="float-start btn btn-info">
          Back to Menu
        </button>
      </router-link>
      <div class="clearfix"></div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <div class="clearfix"></div>
          <div class="text-center">
            <h1 class="mb0">{{ locName }}</h1>
            <p class="text-muted">{{ locAddress }}</p>
          </div>
          <div class="clearfix"></div>
          <p class="text-danger">
            Are you sure you want to delete all Items for the above location?
          </p>
          <p class="text-danger">
            When deleting these items, you will no longer see them...
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
  name: "DeleteAllItems",
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
      locName: "",
      locAddress: "",
      allItemsIdIs: [],
    };
  },
  async mounted() {
    const user = JSON.parse(localStorage.getItem("user-info") || "{}");
    if (!user.id) {
      this.$router.push({ name: "SignView" });
      return;
    }

    this.userId = user.id;
    await this.fetchLocationInfo();
    await this.fetchAllItems();
    await this.checkUserAccess();
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "Menu",
        params: { locationId: this.locationId },
      });
    },
    async fetchLocationInfo() {
      try {
        const { data } = await axios.get(`http://localhost:3000/locations`, {
          params: { userId: this.userId, id: this.locationId },
        });
        if (data.length) {
          this.locName = data[0].name;
          this.locAddress = data[0].address;
        }
      } catch (error) {
        this.errorMessage = "Failed to fetch location information.";
      }
    },
    async fetchAllItems() {
      try {
        const { data } = await axios.get(`http://localhost:3000/items`, {
          params: { userId: this.userId, locId: this.locationId },
        });
        this.allItemsIdIs = data.map((item) => item.id);
      } catch (error) {
        this.errorMessage = "Failed to fetch items.";
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
    async deleteAllItems() {
      try {
        const deletePromises = this.allItemsIdIs.map((id) =>
          axios.delete(`http://localhost:3000/items/${id}`)
        );
        await Promise.all(deletePromises);
        this.successMessage = "All items have been deleted.";
        this.errorMessage = "";
        setTimeout(() => {
          this.$router.push({
            name: "Menu",
            params: { locationId: this.locationId },
          });
        }, 2000);
      } catch (error) {
        this.successMessage = "";
        this.errorMessage = "Failed to delete items.";
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
