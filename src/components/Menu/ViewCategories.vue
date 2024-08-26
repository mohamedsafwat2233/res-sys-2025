<template>
  <AppNavbar />
  <div class="container">
    <router-link
      :to="{ name: 'AddNewCategory', params: { locationId: locationId } }"
    >
      <button class="btn btn-info">Add Category</button>
    </router-link>
    &nbsp;&nbsp;
    <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
      <button class="btn btn-success">Back to Menu</button>
    </router-link>
    <br />
    <div class="text-center">
      <h1 class="mb0">{{ locName }}</h1>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
    <table class="table caption-top" v-if="listOfCategories.length > 0">
      <caption>
        <span> List of Categories ({{ listOfCategories.length }}) </span>
        <span class="float-end">
          <router-link
            :to="{
              name: 'DeleteAllCategories',
              params: { locationId: locationId },
            }"
          >
            <button class="btn btn-danger">Delete All</button>
          </router-link>
        </span>
      </caption>
      <thead class="table-dark">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cat, i) in listOfCategories" :key="i">
          <th scope="row">{{ cat.name }}</th>
          <td>
            <router-link
              :to="{
                name: 'UpdateCategory',
                params: { catId: cat.id, locationId: cat.locationId },
              }"
            >
              <button class="btn btn-info">Update</button>
            </router-link>
            &nbsp;
            <router-link
              :to="{
                name: 'DeleteCategory',
                params: { catId: cat.id, locationId: cat.locationId },
              }"
            >
              <button class="btn btn-danger">Delete</button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="alert alert-warning mt15" role="alert">
      No Categories Added Yet
    </div>
  </div>
</template>

<script>
import AppNavbar from "@/components/header/AppNavbar.vue";
import axios from "axios";

export default {
  name: "ViewCategories",
  components: { AppNavbar },
  data() {
    return {
      locationId: this.$route.params.locationId,
      userId: "",
      locName: "",
      locAddress: "",
      listOfCategories: [], // Local state for categories
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "SignView" });
    } else {
      this.userId = JSON.parse(user).id;
      await this.loadData();
    }
  },
  methods: {
    async loadData() {
      await this.loadLocationInfo();
      await this.loadCategories();
    },
    async loadCategories() {
      try {
        let response = await axios.get(
          `http://localhost:3000/categories?locationId=${this.locationId}`
        );
        if (response.status === 200) {
          this.listOfCategories = response.data;
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    },
    async loadLocationInfo() {
      try {
        let response = await axios.get(
          `http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`
        );
        if (response.status === 200 && response.data.length > 0) {
          const data = response.data[0];
          this.locName = data.name;
          this.locAddress = data.address;
        }
      } catch (error) {
        console.error("Failed to load location info", error);
      }
    },
  },
};
</script>

<style>
.mb0 {
  margin-bottom: 0;
}
</style>
