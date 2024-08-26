import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignView from "@/views/SignView.vue";
import LoginView from "../views/LoginView.vue";
import ProfileView from "@/views/ProfileView.vue";
import ErrorPage from "@/views/ErrorPage.vue";
import UpdateProfile from "@/components/UpdateProfile.vue";
import AddNewLocation from "../components/Locations/AddNewLocation.vue";
import DeleteLocation from "../components/Locations/DeleteLocation.vue";
import DeleteAllLocations from "../components/Locations/DeleteAllLocations.vue";
import UpdateLocation from "../components/Locations/UpdateLocation.vue";
import Menu from "../components/Menu/Menu.vue";
import UpdateCategory from "../components/Menu/UpdateCategory.vue";
import AddNewCategory from "../components/Menu/AddNewCategory.vue";
import ViewCategories from "../components/Menu/ViewCategories.vue";
import DeleteCategory from "../components/Menu/DeleteCategory.vue";
import DeleteAllCategories from "../components/Menu/DeleteAllCategories.vue";
import AddNewItem from "../components/Menu/AddNewItem.vue";
import UpdateItem from "../components/Menu/UpdateItem.vue";
import DeleteItem from "../components/Menu/DeleteItem.vue";
import DeleteAllItems from "../components/Menu/DeleteAllItems.vue";

const routes = [
  {
    path: "/",
    name: "HomeView",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/SignView",
    name: "SignView",
    component: SignView,
  },
  {
    path: "/LoginView",
    name: "LoginView",
    component: LoginView,
  },
  {
    path: "/ProfileView",
    name: "ProfileView",
    component: ProfileView,
  },
  {
    path: "/UpdateProfile",
    name: "UpdateProfile",
    component: UpdateProfile,
  },
  {
    path: "/add-new-location",
    name: "AddNewLocation",
    component: AddNewLocation,
  },
  {
    path: "/update/location/:locationId",
    name: "UpdateLocation",
    component: UpdateLocation,
  },
  {
    path: "/locations/deleteAll",
    name: "DeleteAllLocations",
    component: DeleteAllLocations,
  },
  {
    path: "/Menu/location/:locationId",
    name: "Menu",
    component: Menu,
  },
  {
    path: "/menu/categories/add/:locationId",
    name: "AddNewCategory",
    component: AddNewCategory,
  },
  {
    path: "/menu/item/update/:itemId/loc/:locationId",
    name: "UpdateItem",
    component: UpdateItem,
  },
  {
    path: "/menu/item/:itemId/delete/loc/:locationId",
    name: "DeleteItem",
    component: DeleteItem,
  },
  {
    path: "/menu/items/delete-all/:locationId",
    name: "DeleteAllItems",
    component: DeleteAllItems,
  },
  {
    path: "/menu/items/add/:locationId",
    name: "AddNewItem",
    component: AddNewItem,
  },
  {
    path: "/menu/categories/update/:locationId/:catId",
    name: "UpdateCategory",
    component: UpdateCategory,
  },
  {
    path: "/menu/categories/delete/loc/:locationId/item/:catId",
    name: "DeleteCategory",
    component: DeleteCategory,
  },
  {
    path: "/menu/categories/view/:locationId",
    name: "ViewCategories",
    component: ViewCategories,
  },
  {
    path: "/menu/categories/view/:locationId",
    name: "ViewCategories",
    component: ViewCategories,
  },
  {
    path: "/menu/categories/delete/all/:locationId",
    name: "DeleteAllCategories",
    component: DeleteAllCategories,
  },
  {
    path: "/delete-location/:locationId",
    name: "DeleteLocation",
    component: DeleteLocation,
  },
  //stays last
  {
    path: "/:catchAll(.*)",
    name: "ErrorPage",
    component: ErrorPage,
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
