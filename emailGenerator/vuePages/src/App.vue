<template>
  <main class="appMain">
<!-- <NavBarDev /> -->
    <!-- ADDING VIEWS PAGES -->
    <router-view />
  </main>
</template>

<script>
// import NavBarDev from "@/components/NavBarDev.vue";
export default {
  name: "App",
  components: {
    // NavBarDev,
  }
};
</script>

<style lang="scss">
.app main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
