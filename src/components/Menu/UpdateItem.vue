<template>
  <AppNavbar />
  <div class="container">
    <div class="clearfix"></div>
    <router-link :to="{ name: 'Menu', params: { locationId: locationId } }">
      <button type="button" class="float-start btn btn-info">
        Back to Menu
      </button>
    </router-link>
    <div class="clearfix"></div>
    <br />
    <div class="text-center">
      <h4 class="mb0">{{ locName }}</h4>
      <p class="text-muted">{{ locAddress }}</p>
    </div>
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <hr />
          <h1>Update Item</h1>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemName.$error }"
          >
            <input
              type="text"
              class="w250 form-control"
              id="floatItemName"
              placeholder="Enter Item Name"
              v-model.trim="itemName"
            />
            <label for="floatItemName">Enter Item Name</label>
            <span class="error-feedback" v-if="v$.itemName.$error">{{
              v$.itemName.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemPrice.$error }"
          >
            <input
              type="Number"
              class="w250 form-control"
              id="floatItemPrice"
              placeholder="Enter Item Price"
              v-model.trim="itemPrice"
            />
            <label for="floatItemPrice">Enter Item Price</label>
            <span class="error-feedback" v-if="v$.itemPrice.$error">{{
              v$.itemPrice.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.itemsQty.$error }"
          >
            <input
              type="number"
              class="w250 form-control"
              id="floatItemQty"
              placeholder="Enter Item Quantities"
              v-model.trim="itemsQty"
            />
            <label for="floatItemQty">Enter Item Quantities</label>
            <span class="error-feedback" v-if="v$.itemsQty.$error">{{
              v$.itemsQty.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.description.$error }"
          >
            <textarea
              class="w250 form-control h100"
              placeholder="Enter Item Descriptions"
              id="floatItemDescriptions"
              v-model.trim="description"
            ></textarea>
            <label for="floatItemDescriptions">Enter Item Descriptions</label>
            <span class="error-feedback" v-if="v$.description.$error">{{
              v$.description.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="form-floating mb-3"
            :class="{ 'form-group-error': v$.pickedCategory.$error }"
          >
            <select
              class="w250 form-select"
              id="floatItemCategory"
              v-model.trim="pickedCategory"
            >
              <option
                v-for="(cat, i) in listOfCategories"
                :key="i"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
            <label for="floatItemCategory">Select Category Name</label>
            <span class="error-feedback" v-if="v$.pickedCategory.$error">{{
              v$.pickedCategory.$errors[0].$message
            }}</span>
          </div>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="button"
            @click="updateItem"
            class="w250 btn btn-warning"
          >
            Update Now
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
          class="col-auto d-block mx-auto alert alert-danger"
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
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength, between } from "@vuelidate/validators";
import axios from "axios";

export default {
  components: { AppNavbar },
  name: "UpdateItem",
  data() {
    return {
      v$: useValidate(),
      userId: "",
      locationId: this.$route.params.locationId,
      itemId: this.$route.params.itemId,
      locName: "",
      locAddress: "",
      successMessage: "",
      errorMessage: "",
      pickedCategory: "",
      itemName: "",
      description: "",
      itemsQty: 1,
      itemPrice: "",
      listOfCategories: [], // Local state for categories
    };
  },
  validations() {
    return {
      itemName: { required, minLength: minLength(6) },
      description: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(120),
      },
      itemsQty: { required, between: between(1, 100000) },
      itemPrice: { required, between: between(0, 1000000) },
      pickedCategory: { required },
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
      await this.loadCategories();
      await this.loadLocationInfo();
      await this.loadItemInfo();
    },
    async loadCategories() {
      try {
        let response = await axios.get(`http://localhost:3000/categories`);
        if (response.status == 200) {
          this.listOfCategories = response.data;
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    },
    async loadItemInfo() {
      try {
        let response = await axios.get(
          `http://localhost:3000/items?userId=${this.userId}&locId=${this.locationId}&id=${this.itemId}`
        );
        if (response.status == 200 && response.data.length > 0) {
          const data = response.data[0];
          this.itemName = data.name;
          this.itemPrice = data.price;
          this.description = data.description;
          this.itemsQty = data.qty;
          this.pickedCategory = data.catId;
        }
      } catch (error) {
        console.error("Failed to load item info", error);
      }
    },
    async loadLocationInfo() {
      try {
        let response = await axios.get(
          `http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`
        );
        if (response.status == 200 && response.data.length > 0) {
          const data = response.data[0];
          this.locName = data.name;
          this.locAddress = data.address;
        }
      } catch (error) {
        console.error("Failed to load location info", error);
      }
    },
    async updateItem() {
      this.v$.$validate();
      if (!this.v$.$error) {
        try {
          let response = await axios.put(
            `http://localhost:3000/items/${this.itemId}`,
            {
              name: this.itemName,
              price: parseFloat(this.itemPrice).toFixed(2),
              description: this.description,
              qty: parseInt(this.itemsQty),
              userId: this.userId,
              locId: parseInt(this.locationId),
              catId: this.pickedCategory,
            }
          );
          if (response.status == 200) {
            this.successMessage = "Item Updated Successfully ...";
            setTimeout(() => {
              this.$router.push({
                name: "Menu",
                params: { locationId: this.locationId },
              });
            }, 2000);
          } else {
            this.errorMessage = "Something went wrong, please try again!";
          }
        } catch (error) {
          this.errorMessage = "Something went wrong, please try again!";
        }
      } else {
        this.errorMessage = "You must fill in all required fields!";
      }
    },
  },
};
</script>

<style>
.mb {
  margin-bottom: 0;
}
.w250 {
  min-width: 250px;
}
.h100 {
  min-height: 100px !important;
}
.form-group-error {
  color: red;
}
.form-group-error input,
.form-group-error select,
.form-group-error textarea {
  border-color: red;
}
</style>
