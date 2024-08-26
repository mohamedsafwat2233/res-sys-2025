<template>
  <div class="container">
    <AppNavbar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <h1>Delete Restaurant #{{ deleteLoction }}</h1>
          <hr />
          <p class="text-danger">
            Are you sure you want to delete this location?
          </p>
          {{ name }}<br />
          {{ address }}<br />
          {{ phone }}<br />
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto mx-auto d-block">
          <button class="btn btn-info" @click="goBack()">Go Back</button>
          &nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="deleteLocation()">
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
  name: "DeleteLocation",
  components: {
    AppNavbar,
  },
  data() {
    return {
      name: "",
      address: "",
      phone: "",
      userId: "",
      deleteLoction: "",
      locationData: [],
      successMessage: "",
      errorMessage: "",
      allItemsIdIs: [],
      allCatsIdIs: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "SignView" });
    } else {
      this.deleteLoction = this.$route.params.locationId;
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      try {
        const [itemsResult, categoriesResult] = await Promise.all([
          axios.get(`http://localhost:3000/items?locId=${this.deleteLoction}`),
          axios.get(
            `http://localhost:3000/categories?locationId=${this.deleteLoction}`
          ),
        ]);

        this.allItemsIdIs = itemsResult.data.map((item) => item.id);
        this.allCatsIdIs = categoriesResult.data.map((cat) => cat.id);
      } catch (error) {
        this.errorMessage = "Failed to load data";
      }
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: "HomeView" });
    },
    async canCurrentUserAccessThisLocation() {
      try {
        const result = await axios.get(
          `http://localhost:3000/locations?id=${this.deleteLoction}&userId=${this.userId}`
        );
        if (result.status === 200 && result.data.length > 0) {
          const location = result.data[0];
          this.name = location.name;
          this.address = location.address;
          this.phone = location.phone;
        } else {
          this.$router.push({ name: "HomeView" });
        }
      } catch {
        this.$router.push({ name: "HomeView" });
      }
    },
    async deleteLocation() {
      try {
        const deleteRequests = [
          axios.delete(`http://localhost:3000/locations/${this.deleteLoction}`),
          ...this.allCatsIdIs.map((id) =>
            axios.delete(`http://localhost:3000/categories/${id}`)
          ),
          ...this.allItemsIdIs.map((id) =>
            axios.delete(`http://localhost:3000/items/${id}`)
          ),
        ];

        const results = await Promise.all(deleteRequests);

        if (results.every((response) => response.status === 200)) {
          this.successMessage = "Location and related data have been deleted.";
          this.errorMessage = "";
          setTimeout(() => {
            this.$router.push({ name: "HomeView" });
          }, 2000);
        } else {
          this.successMessage = "";
          this.errorMessage = "Failed to delete some data.";
        }
      } catch {
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
  color: rgb(20, 231, 20);
}
.alert-warning {
  color: orange;
}
</style>
