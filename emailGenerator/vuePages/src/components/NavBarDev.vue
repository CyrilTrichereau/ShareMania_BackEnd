<template>
  <!-- 
ADD TO VIEW
import NavBarDev from "@/components/NavBarDev.vue";
LINK BAR FOR PRODUCTION -- ERASE BEFORE PRODUCTION
<NavBarDev />
 -->
  <div id="navBarDev">
    <router-link to="/ConfirmInscription">ConfirmInscription</router-link> |
    <router-link to="/ResetYourPassword">ResetYourPassword</router-link> |
    <router-link to="/ConfirmNewPassword">ConfirmNewPassword</router-link> |
    <router-link to="/ConfirmChanges">ConfirmChanges</router-link> |
    <router-link to="/ConfirmEraseProfile">ConfirmEraseProfile</router-link> |
  </div>
</template>

<script>
export default {
  name: "NavBarDev",
};
</script>

<style scoped lang="scss">
#navBarDev {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 99;
  padding: 0;

  & a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
