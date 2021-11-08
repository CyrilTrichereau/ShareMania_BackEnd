<template>
  <div class="resetPassword">
    <div class="resetPasswordHeader">
      <img
        src="@/../public/images/groupomaniaLogoWhite100pxTinyfied.png"
        alt="ShareMania Logo"
        class="resetPasswordHeaderLogo"
      />
      <p class="h1 text-light resetPasswordHeaderText">
        ShareMania
      </p>
    </div>
    <div class="bg-primary resetPasswordMain">
      <h1 class="h5 text-primary resetPasswordMainTitle">
        Confirmation de modification de profil
      </h1>

      <img
        src="https://media0.giphy.com/media/1kHygQGV6urCSyaQga/giphy.webp?cid=64072d54pbkpgyvx4tl3uvaawfdow1qp1qc24gs6zafhys3l&rid=giphy.webp&ct=g"
        alt="Gif chnagements accomplis"
        class="resetPasswordMainGif"
      />

      <h2 class="h3 text-light resetPasswordMainSubTitle">
        Vos dernières modifications ont bien été prises en compte.
      </h2>
      <a href="changeUrlHere" class="resetPasswordMainRedirection">
        <Button text="Retourner sur ShareMania" />
      </a>
    </div>
    <div class="resetPasswordFooter">
      <h3 class="resetPasswordFooterInfos">
        Si vous n'êtes pas à l'origine de ce message,  signalez le à votre manager.
      </h3>
    </div>
  </div>
</template>

<script>
import Button from "@/components/form/Button.vue";

export default {
  name: "ConnectionPage",
  components: {
    Button,
  },
};
</script>

<style scoped lang="scss">
// ----------
// COLORS
// ----------
$primary: #4d7c8a;
$secondary: #938f60;
$success: #28a745;
$danger: #c02200;
$warning: rgb(107, 159, 255);
$info: rgba(77, 124, 138, 0.05);
$light: #fdfeff;
$dark: #3c464e;

// ----------
// FONT FAMILY
// ----------

@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
a {
  font-family: "Source Sans Pro", "Trebuchet MS", sans-serif, "Times New Roman";
  color: $dark;
}

.resetPassword {
  width: 92%;
  max-width: 800px;
  padding: 0;
  overflow: hidden;
  margin: 1rem auto;
  background: $light;
  border-radius: 5px;
  box-shadow: 0 0 2px $primary;
  &Header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 0.3rem;
    padding: 1.5rem 0;
    background: $primary;

    &Logo {
      width: 2.7rem;
      margin: 0 0.5rem;
    }
    &Text {
      margin: 0;
      font-size: 2.5rem;
      color: $light;
    }
  }
  &Main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 2rem 0;
    &Title {
      color: $primary;
      font-size: 2rem;
      width: 80%;
      text-align: center;
    }
    &Gif {
      max-width: 80%;
      max-height: 300px;
    }
    &SubTitle {
      width: 80%;
      margin: 1rem 0;
      font-size: 1.6rem;
      color: $secondary;
      font-weight: 400;
      text-align: center;
    }
    &Redirection {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-decoration: none;
    }
  }
  &Footer {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 2rem 0;
    margin-top: 2rem;
    background: $primary;
    &Infos {
      width: 80%;
      font-size: 1.2rem;
      color: $light;
      text-align: center;
      font-style: italic;
      font-weight: 100;
      margin: 0;
    }
  }
}
</style>
