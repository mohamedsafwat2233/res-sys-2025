<template>
  <AppNavbar />
  <div class="container">
    <div>
      <router-link
        :to="{ name: 'ViewCategories', params: { locationId: locationId } }"
      >
        <button type="button" class="float-start btn btn-success">
          View/Add Categories
        </button>
      </router-link>
      <router-link
        :to="{ name: 'AddNewItem', params: { locationId: locationId } }"
      >
        <button
          type="button"
          class="float-end btn btn-success"
          v-if="numOfCategories > 0"
        >
          Add New Items
        </button>
      </router-link>
    </div>
    <div class="clearfix"></div>
    <div class="text-center">
      <h1 class="mb-0">{{ locName }}</h1>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
    <div class="clearfix"></div>
    <router-link
      v-if="listOfUserCategories.length > 0"
      :to="{ name: 'DeleteAllItems', params: { locationId: locationId } }"
    >
      <button type="button" class="btn btn-danger">Delete All Items</button>
    </router-link>
    <div class="clearfix"></div>
    <br />
    <div class="each-category">
      <div v-for="(cat, i) in listOfUserCategories" :key="i">
        <div class="row">
          <div class="col-12 catName">
            <h3 class="text-center bg-light p-1">{{ cat.name }}</h3>
          </div>
          <div
            v-for="(item, h) in listOfUserItems.filter(
              (i) => i.catId === cat.id
            )"
            :key="h"
            class="col-xs-12 col-sm-4 px-4"
          >
            <div class="each-item">
              <h4 class="item-name">{{ item.name }}</h4>
              <p class="item-description text-muted">{{ item.description }}</p>
              <div>
                <div class="available-items float-start text-muted">
                  Available Qty: {{ numberWithCommas(item.qty) }}
                </div>
                <div class="item-price float-end text-muted">
                  Price: {{ numberWithCommas(item.price) }}
                </div>
              </div>
              <div class="clearfix"></div>
              <div class="p-1 mt-2">
                <div class="available-items float-start">
                  <router-link
                    :to="{
                      name: 'UpdateItem',
                      params: { itemId: item.id, locationId: locationId },
                    }"
                  >
                    <button type="button" class="float-end btn btn-info">
                      Update
                    </button>
                  </router-link>
                </div>
                <div class="item-price float-end">
                  <router-link
                    :to="{
                      name: 'DeleteItem',
                      params: { itemId: item.id, locationId: locationId },
                    }"
                  >
                    <button type="button" class="float-end btn btn-danger">
                      Delete
                    </button>
                  </router-link>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
            <hr />
          </div>
        </div>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import AppNavbar from "@/components/header/AppNavbar.vue";
import axios from "axios";
/* eslint-disable */
export default {
  components: { AppNavbar },
  name: "Menu",
  data() {
    return {
      locationId: this.$route.params.locationId,
      locName: "",
      locAddress: "",
      listOfUserCategories: [],
      listOfUserItems: [],
      numOfCategories: 0,
    };
  },
  async mounted() {
    const user = JSON.parse(localStorage.getItem("user-info") || "{}");
    if (!user.id) {
      this.$router.push({ name: "SignView" });
      return;
    }

    try {
      await Promise.all([
        this.loadLocationInfo(user.id),
        this.loadCategories(user.id),
        this.loadItems(user.id),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  },
  methods: {
    async loadLocationInfo(userId) {
      try {
        const response = await axios.get(`http://localhost:3000/locations`, {
          params: { userId, id: this.locationId },
        });
        if (response.status === 200 && response.data.length > 0) {
          const location = response.data[0];
          this.locName = location.name;
          this.locAddress = location.address;
        }
      } catch (error) {
        console.error("Failed to load location info:", error);
      }
    },
    async loadCategories(userId) {
      try {
        const response = await axios.get(`http://localhost:3000/categories`, {
          params: { userId, locationId: this.locationId },
        });
        if (response.status === 200) {
          this.listOfUserCategories = response.data;
          this.numOfCategories = this.listOfUserCategories.length;
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    },
    async loadItems(userId) {
      try {
        const response = await axios.get(`http://localhost:3000/items`, {
          params: { userId, locId: this.locationId },
        });
        if (response.status === 200) {
          this.listOfUserItems = response.data;
        }
      } catch (error) {
        console.error("Failed to load items:", error);
      }
    },
    numberWithCommas(n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>

<style scoped>
.mb-0 {
  margin-bottom: 0;
}
.item-description {
  padding-top: 12px;
  min-height: 100px;
}
.each-item {
  padding: 10px;
}
</style>
