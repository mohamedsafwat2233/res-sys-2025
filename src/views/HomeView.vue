<template>
  <div class="container">
    <AppNavbar />
    <p class="text-end">
      Welcome {{ userName }}
      <router-link :to="{ name: 'ProfileView' }">
        <button class="btn btn-info" type="button">Profile</button>
      </router-link>
    </p>
    <router-link :to="{ name: 'AddNewLocation' }">
      <button type="button" class="btn btn-primary">Add New Restaurant</button>
    </router-link>
    <br />
    <br />
    <AddNewLocation />
    <br />
    <UserLocations :allLocations="listOfLocations" />
  </div>
</template>
<script>
// import AddNewLocation from "@/components/Locations/AddNewLocation.vue";
import AppNavbar from "@/components/header/AppNavbar.vue";
import axios from "axios";
import UserLocations from "@/components/Locations/UserLocations.vue";

export default {
  name: "HomeView",
  data() {
    return {
      userName: "",
      userId: "",
      listOfLocations: [],
    };
  },
  components: {
    AppNavbar,
    // AddNewLocation,
    UserLocations,
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (user && this.$route.name === "SignView") {
      this.$router.push({ name: "HomeView" });
    } else {
      try {
        const parsedUser = JSON.parse(user);
        this.userName = parsedUser.name;
        this.userId = parsedUser.id;

        const result = await axios.get(
          `http://localhost:3000/locations?userId=${this.userId}`
        );

        if (
          result.status === 200 &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          console.log(result.data);
          this.listOfLocations = result.data;
        } else {
          console.warn("No locations found or incorrect data format.");
        }
      } catch (error) {
        console.error("Error parsing user data or fetching locations:", error);
      }
    }
  },
};
</script>

<style scoped></style>
