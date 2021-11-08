<template>
  <div class="resetPassword">
    <div class="resetPasswordHeader">
      <h1 class="resetPasswordHeaderWelcome">Bienvenue sur</h1>
      <div class="resetPasswordHeaderShareMania">
        <img
          src="@/../public/images/groupomaniaLogoWhite100pxTinyfied.png"
          alt="ShareMania Logo"
          class="resetPasswordHeaderShareManiaLogo"
        />
        <p class="resetPasswordHeaderShareManiaText">
          ShareMania
        </p>
      </div>
      <p class="resetPasswordHeaderSubTitle">
        Le plus brûlant des réseaux sociaux
      </p>
    </div>

    <div class="resetPasswordMain">
      <h2 class="resetPasswordMainTitle">&#x1F44F; <br> &#x1F38A;  Bravo, vous êtes bien inscrit !  &#x1F38A; <br> &#x1F44F;</h2>
      <img
        src="https://media3.giphy.com/media/vdMaBwNUZq7W7C337R/giphy.webp?cid=64072d54tc04z7vfp3mszimugztxsjmxwpks2n03h1b1e1gq&rid=giphy.webp&ct=g"
        alt="Gif oublie"
        class="resetPasswordMainGif"
      />
      
      <h2 class="resetPasswordMainSubTitle">Créez des publications, partagez du fun avec vos 	collègues et intéragissez sur leurs réponses !</h2>
      <div class="resetPasswordMainInteractions">
        <div class="resetPasswordMainInteractionsOnFire">
          <p
            class="resetPasswordMainInteractionsOnFireText"
          >
            Ici, on fait chauffer les publications !...
          </p>
          <div class="resetPasswordMainInteractionsOnFireIcon">
            <OnFire :isActive="true" :infinite="true" />
          </div>
        </div>
        <div class="resetPasswordMainInteractionsCold">
          <div class="resetPasswordMainInteractionsColdIcon">
            <Cold :isActive="true" :infinite="true" />
          </div>
          <p
            class="resetPasswordMainInteractionsColdText"
          >
            ou on les refroidit !...
          </p>
        </div>
      </div>

      <h2 class="resetPasswordMainSubTitle">
        A vous de jouer !
      </h2>
      <a href="changeUrlHere" class="resetPasswordMainRedirection">
        <Button text="Retourner sur ShareMania" />
      </a>
    </div>
    <div class="resetPasswordFooter">
      <h3 class="resetPasswordFooterInfos">
        Si vous n'êtes pas à l'origine de ce message, signalez le à votre
        manager.
      </h3>
    </div>
  </div>
</template>

<script>
import Button from "@/components/form/Button.vue";
import OnFire from "@/components/icons/OnFire.vue";
import Cold from "@/components/icons/Cold.vue";

export default {
  name: "ConnectionPage",
  components: {
    Button,
    OnFire,
    Cold,
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
$dangerBox: #ac2304c9;
$warning: rgb(107, 159, 255);
$warningBox: rgba(43, 99, 204, 0.795);
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 0.3rem;
    padding: 1.5rem 0;
    background: $primary;
    &Welcome {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 400;
      color: $light;
    }
    &ShareMania {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100%;
      gap: 0.3rem;
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
    &SubTitle {
      margin: 1rem 0 0 0;
      font-size: 1.2rem;
      font-weight: 400;
      color: $light;
      font-style: italic;
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
      color: $secondary;
      font-size: 2rem;
      width: 80%;
      text-align: center;
    }
    &Gif {
      max-width: 80%;
      max-height: 300px;
    }

    &Interactions {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      margin-top: 1rem;
      gap: 1rem;
      &OnFire {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        width: 92%;
        max-width: 320px;
        padding: 0.5rem 1rem;
        background: $dangerBox;
        border-radius: 15px;
        box-shadow: 0 0 1px $dangerBox;
        &Text {
          margin: 0 1rem 0 0.5rem;
          padding: 0;
          color: $light;
          font-size: 1.2rem;
          text-align: right;
        }
        &Icon {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 70px;
        }
      }
      &Cold {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 92%;
        max-width: 320px;
        padding: 0.5rem 1rem;
        background: $warningBox;
        border-radius: 15px;
        box-shadow: 0 0 1px $warningBox;
        &Text {
          margin: 0 0.5rem 0 1rem;
          padding: 0;
          color: $light;
          font-size: 1.2rem;
          text-align: left;
        }
        &Icon {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          width: 70px;
        }
      }
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
