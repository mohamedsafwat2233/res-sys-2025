<template>
  <table class="table caption-top" v-if="allLocations.length > 0">
    <caption>
      <span> List of Locations ({{ allLocations.length }}) </span>
      <span class="float-end">
        <router-link :to="{ name: 'DeleteAllLocations' }">
          <button class="btn btn-danger">Delete All</button>
        </router-link>
      </span>
    </caption>
    <thead class="table-dark">
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Phone</th>
        <th scope="col">Addres</th>
        <th scope="col">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(loc, i) in allLocations" :key="i">
        <th scope="row">{{ loc.name }}</th>
        <td>{{ loc.phone }}</td>
        <td>{{ loc.address }}</td>
        <td>
          <router-link
            :to="{ name: 'DeleteLocation', params: { locationId: loc.id } }"
          >
            <button class="btn btn-danger">Delete</button>
          </router-link>
          &nbsp;
          <router-link
            :to="{ name: 'UpdateLocation', params: { locationId: loc.id } }"
          >
            <button class="btn btn-info">Update</button>
          </router-link>
          &nbsp;
          <router-link :to="{ name: 'Menu', params: { locationId: loc.id } }">
            <button class="btn btn-success">Menu</button>
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else class="alert alert-warning mt15" role="alert">
    No Locations Added Yet
  </div>
</template>

<script>
// import axios from "axios";
export default {
  name: "UserLocations",
  props: ["allLocations"],
};
</script>

<style>
.mt15 {
  margin-top: 15px;
}
</style>
