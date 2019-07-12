const puppeteer = require('puppeteer');
const config = require('./config/config.json');

const BASE_URL = 'https://instagram.com/?hl=en';
const TAG_URL = (tag) => `https://instagram.com/explore/tags/${tag}/?hl=en`; 

module.exports = {
    browser: null,
    page: null,

    init: async () => {
        browser = await puppeteer.launch({
            headless: config.browserSettings.headless
        });

        page = await browser.newPage(); 
    },

    login: async (user, pass) => {
         /* Indo até a pagina do instagram */
         await page.goto(BASE_URL, config.pageSettings);

         /* Verificando se existe um botão referenciado que contem o texto "Conecte-se" */
         let loginButton = await page.$x(config.buttons.connectButton);
 
         /* Clicando no botão */
         await loginButton[0].click();
 
         /* Aguardando 2 segundos para navegação*/
         await page.waitFor(500);
 
         /* Preenchendo os inputs com usuario e senha passados */
         await page.type(config.inputs.username, user, { delay: 10 });
         await page.type(config.inputs.password, pass, { delay: 10 });
 
         let login = await page.$x(config.buttons.loginButton);
         await login[0].click();
 
         await page.waitFor(5000);

    },

    searchAndLike: async (tags = []) => {

        for(let tag of tags) {
            /* Indo para a página de tags */
            await page.goto(TAG_URL(tag), config.pageSettings);
            await page.waitFor(500);

            let posts = await page.$$(config.selectors.secondDiv);

            for(let i=0; i < 3; i++){
                let post = posts[i];

                /* Clicando no post */

                await post.click();

                /* Esperando o modal aparecer */

                await page.waitFor(config.span.modal);
                await page.waitFor(500);

                let isLikable = await page.$(config.span.like);

                if(isLikable){
                    await page.click(config.span.like);
                    
                }

                await page.waitFor(3000);

                /* Fechando o modal */
                let closeModalButton = await page.$x(config.buttons.closeButton)
                await closeModalButton[0].click();

                await page.waitFor(500);
                
            }
            
            await page.waitFor(10000);

        }

    },
}