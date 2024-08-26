<template>
  <div class="container">
    <AppNavbar />
    <form @submit.prevent="deleteItem">
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
          <p class="text-danger">Are you sure you want to delete this Item?</p>
          <h4>Item Name: {{ itemName }}</h4>
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
  name: "DeleteItem",
  components: {
    AppNavbar,
  },
  data() {
    return {
      locationId: this.$route.params.locationId,
      itemId: this.$route.params.itemId,
      userId: "",
      locName: "",
      locAddress: "",
      itemName: "",
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
    await this.loadLocation();
    await this.loadItem();
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "Menu",
        params: { locationId: this.locationId },
      });
    },
    async loadLocation() {
      try {
        const { data } = await axios.get(`http://localhost:3000/locations`, {
          params: { id: this.locationId, userId: this.userId },
        });
        if (data.length > 0) {
          this.locName = data[0].name;
          this.locAddress = data[0].address;
        } else {
          this.$router.push({ name: "HomeView" });
        }
      } catch (error) {
        this.errorMessage = "Failed to load location.";
      }
    },
    async loadItem() {
      try {
        const { data } = await axios.get(`http://localhost:3000/items`, {
          params: { id: this.itemId },
        });
        if (data.length > 0) {
          const item = data[0];
          this.itemName = item.name;
        } else {
          this.errorMessage = "Item not found.";
        }
      } catch (error) {
        this.errorMessage = "Failed to load item.";
      }
    },
    async deleteItem() {
      try {
        const result = await axios.delete(
          `http://localhost:3000/items/${this.itemId}`
        );
        if (result.status === 200) {
          this.successMessage = "Item is deleted.";
          this.errorMessage = "";
          setTimeout(() => {
            this.$router.push({
              name: "Menu",
              params: { locationId: this.locationId },
            });
          }, 2000);
        } else {
          this.errorMessage = "Failed to delete item.";
        }
      } catch (error) {
        this.errorMessage = "Failed to delete item.";
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
