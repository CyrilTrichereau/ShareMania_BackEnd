// Exported constant
module.exports = {
  email: ({ emailToSend: email }) => {
    return {
      to: email,
      from: process.env.SENDGRID_USER_EMAIL,
      subject: "Inscrivez vous dès maintenant ! - ShareMania.fr",
      text: "ShareMania.fr - Vous recevez ce mail suite à une tentative de connexion avec cette adresse mail. Malheureusement, vous n'avez pas encore de compte chez nous... Inscrivez vous dès maintenant !",
      html: /* html */ `
        <!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style>
        @import"https://fonts.googleapis.com/css?family=Source+Sans+Pro";body{width:100%;height:100%}body,h1,h2,h3,h4,h5,h6,p,a{font-family:"Source Sans Pro","Trebuchet MS",sans-serif,"Times New Roman";color:#3c464e}body{width:100%;height:100%;margin:0 auto}.resetPassword{width:92%;max-width:800px;padding:0;overflow:hidden;margin:16px auto;background-color:#fdfeff;-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px;border:#3c464e 1px solid}.resetPasswordHeader{width:100%;padding:32px 0;margin:0 auto;background-color:#4d7c8a}.resetPasswordHeaderWelcome{width:100%;margin:0 auto 0 5px;padding:0;font-size:36px;font-weight:600;color:#fdfeff;text-align:center}.resetPasswordHeaderShareMania{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;width:100%}.resetPasswordHeaderShareManiaLogo{wwidth:49px;height:50px;padding:0;margin:0 5px 0 auto}.resetPasswordHeaderShareManiaText{margin:0 auto 0 5px;padding:0;font-size:48px;font-weight:600;color:#fdfeff}.resetPasswordHeaderSubTitle{width:80%;margin:16px auto;padding:0;font-size:20px;color:#fdfeff;font-weight:400;text-align:center}.resetPasswordMain{margin:0 auto;width:100%;padding:32px 0 0 0}.resetPasswordMainTitle{color:#4d7c8a;font-size:32px;width:80%;text-align:center;margin:0 auto;padding:0}.resetPasswordMainTitleEmoji{font-size:20px}.resetPasswordMainGif{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;margin:0 auto;padding:0;max-width:80%;max-height:300px}.resetPasswordMainSubTitle{width:80%;margin:16px auto;padding:0;font-size:24px;color:#938f60;font-weight:400;text-align:center}.resetPasswordMainRedirection{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;margin:0 auto;padding:0;text-decoration:none}.resetPasswordFooter{width:100%;margin:32px auto 0 auto;padding:32px 0;background-color:#4d7c8a}.resetPasswordFooterInfos{width:80%;margin:0 auto;font-size:18px;color:#fdfeff;text-align:center;font-style:italic;font-weight:100}.validateButton{padding:16px 32px;margin:0 auto;font-family:"Source Sans Pro","Trebuchet MS",sans-serif,"Times New Roman";background-color:#4d7c8a;border:none;-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px;font-size:22px;color:#fdfeff;cursor:pointer;text-decoration:none}.validateButton:hover{background-color:#3c464e}.w-100{width:100%;padding:16px 0}.wrapper{margin:0 auto}

    </style>

    <!-- Title and description -->
    <title>Bienvenue sur ShareMania.fr !</title>
    <meta
      name="Inscrivez vous à ShareMania.fr, le plus brûlant des réseaux sociaux !"
      content="Vous recevez ce mail suite à une tentative de connexion avec cette adresse mail. Malheureusement, vous n'avez pas encore de compte chez nous... Inscrivez vous dès maintenant !"
    />
  </head>
  <!--     BODY     -->

  <body>
    <div class="resetPassword">
      <div class="resetPasswordHeader">
        <h1 class="resetPasswordHeaderWelcome">Bienvenue sur</h1>
        <div class="resetPasswordHeaderShareMania">
          <img
            src="https://sharemania.fr/images/groupomaniaLogoWhite100pxTinyfied.png"
            alt="ShareMania Logo"
            class="resetPasswordHeaderShareManiaLogo"
          />
          <p class="resetPasswordHeaderShareManiaText">ShareMania.fr</p>
        </div>
        <p class="resetPasswordHeaderSubTitle">
          Le plus brûlant des réseaux sociaux
        </p>
      </div>

      <div class="resetPasswordMain">
        <div class="w-100">
          <h2 class="resetPasswordMainTitle">
            <span class="resetPasswordMainTitleEmoji">&#x1F44B; </span>
            Pas encore inscrit ?
          </h2>
        </div>
        <div class="w-100">
          <img
            src="https://media4.giphy.com/media/xT0xeKCUSj4rf5oGg8/giphy.webp?cid=64072d544jdoxejotplbur2x527u7lwgx3p32my07jwv7e31&rid=giphy.webp&ct=g"
            alt="Gif fun"
            class="resetPasswordMainGif"
          />
        </div>

        <div class="w-100">
          <h2 class="resetPasswordMainSubTitle">
            Créez des publications, partagez du fun avec vos collègues et
            intéragissez sur leurs réponses !
          </h2>
        </div>
        <div class="w-100">
          <h2 class="resetPasswordMainSubTitle">
            Inscrivez vous dès maintenant ! 
            <span class="resetPasswordMainTitleEmoji">&#x1F680; </span>
          </h2>
        </div>
        <div class="w-100">
        <a href="${process.env.FRONT_END_HOST}/login" class="resetPasswordMainRedirection">
            <button class="validateButton">S'inscrire</button>
          </a>
        </div>
      </div>
      <div class="resetPasswordFooter">
        <h3 class="resetPasswordFooterInfos">
          Cet email est un mail automatique.
        </h3>
      </div>
    </div>
  </body>
</html>

        `,
    };
  },
};
