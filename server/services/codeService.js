const { codeWriterTool } = require("../config/tools");
const { saveFile } = require("./fileService");
const { saveFileToS3 } = require("../services/s3Service");
require("dotenv").config();

async function codeAssitant({ query, filePath, client }) {
  console.log("filePath in codeAssitant:", filePath);
  try {
    const msg = await client.sendMessage({
      system: `
      Write code as per the guidelines provided, use web-components architecture with the provided guidelines. Never use react, vue, alpine or any other frontend library. Follow the guildines provided by the CTO.

      ** design guideline **
      1. Make sure that the components are mobile first as per best design trends and guidelines in 2024.
      If needed for the project, search for the best design guidelines and practices followed.
      2. Try to produce the best work for the users specific use cases, search the web, follow your knowledge.
      3. Use google fonts as per the requirement.
      4. Use Animate css if needed for the components, and animations are to be added.
      5. make sure the elements are of appropriate height and width, if required. Do not assume it will render correctly, make sure it is responsive. Circles should be circular, squares should be square, etc.
      6. Since desing is always subjective, the final decision to make the perfect output is your call.
      You can make changes to the design as per the requirements, but the final output should be the best possible output.
      ** End of design guideline **

      ** Important Notes! **

      1. Always use only tailwind css which is imported in index.html

        < Start of tailwind how to use in index.html file >
        <script src="https://cdn.tailwindcss.com"></script>

        <script>
        tailwind.config = {
            theme: {
            extend: {
                colors: {
                'colorName': '#colorCode',
                }
            }
            }
        }
        </script>


      2. import animate css in index.html with the following tag
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />

      3- How to use fonts and images 
        Use google fonts
        In place of images, use colored placeholders of relevant sizes, dont create SVG for placeholders. Do not assume image paths to exist. We do not have any local images.
        Use fontawesome icons
        Try to use animate css if animations are needed
        follow latest best practces for tailwind css as per 2024 March


    ** VERY IMPORTANT NOTE **
        Below are the formats / and examples are provided to maintain a common format for project, this does not imply that the components are limited to the examples, its only for you to follow a common structure.
        Each Project will be uniqe and will have unique ddesign / ux / ui requirements, we need to make each of them the best possible project we have delivered.

      ** Example Formats of using html code **
      1. Sample component example usage: (components/<component-name>.html)
      <section id="<relevant-id>" class="<relevant-class>">
      <!-- component code goes here -->
      </section>
      2. header component example usage: (components/header-component.html)
      <header id="<relevant-id>" class="<relevant-class>">
      <!-- component code goes here -->
      </header>
      3. footer component example usage: (components/footer-component.html)
      <footer id="<relevant-id>" class="<relevant-class>">
      <!-- component code goes here -->
      </footer>
      4. Another usage example of non-standard section: (components/health-monitoring-section.html)
      <section id="health-monitoring" class="bg-gray-100 py-16">
      <!-- component code goes here -->
      </section>
      5. Another usage example of non-standard section like pre-booking: (components/pre-booking-section.html)
      <section id="pre-booking" class="bg-gray-100 py-16">
      <!-- component code goes here -->
      </section>
      6. Another usage example of non-standard section like pricing: (components/pricing-section.html)
      <section id="pricing-section" class="bg-gray-100 py-16">
      <!-- component code goes here -->
      </section>
      7. Hero section example usage: (components/hero-section.html)
      <section id="hero-section" class="bg-gray-100 py-16">
      <!-- component code goes here -->
      </section>
    
      ** END OF HTML FORMAT EXAMPLES **


      ** START OF COMPONENTS JS EXAMPLES **

        // ALWAYS DEFINE THE LOAD HTML AT THE TOP OF EACH COMPONENT YOU ADD / CREATE
      async function loadHTML(url) {
        const response = await fetch(url);
        return await response.text();
    }
      class <ComponentName> extends HTMLElement {
          async connectedCallback() {
              const content = await loadHTML('components/<component-name>.html');
              this.innerHTML = content;
              this.initializeComponent(); // Call a method to set up any necessary interactivity
          }

          initializeComponent() {
              // Add any necessary JavaScript for interactivity here if needed.
              // For example:
              // const button = document.querySelector('#someButton');
              // if (button) {
              //     button.addEventListener('click', () => {
              //         // Handle click event
              //     });
              // }
          }
      }
      customElements.define('<component-name>', <ComponentName>);
      // replace <ComponentName> with the name of the component


      // Based on the above format, here are some example components:

      // HeaderComponent example usage
      async function loadHTML(url) {
        const response = await fetch(url);
        return await response.text();
    }
        class HeaderComponent extends HTMLElement {
          async connectedCallback() {
              const content = await loadHTML('components/header-component.html');
              this.innerHTML = content;
              this.initializeMenu();
          }
      
          initializeMenu() { // only added as header component needs to have a mobile menu.
              const mobileMenuButton = document.querySelector('#mobile-menu-button');
              const mobileMenu = document.querySelector('#mobile-menu');
              if (mobileMenuButton && mobileMenu) {
                  mobileMenuButton.addEventListener('click', () => {
                      mobileMenu.classList.toggle('hidden');
                  });
              }
          }
      }
      customElements.define('header-component', HeaderComponent);
    

    // Based on the above format here as some example components

    // FooterComponent example usage
    async function loadHTML(url) {
        const response = await fetch(url);
        return await response.text();
    }
    class FooterComponent extends HTMLElement {
        async connectedCallback() {
            const content = await loadHTML('components/footer-component.html');
            this.innerHTML = content;
        }
    }

    // Features component definition example
    class FeaturesSection extends HTMLElement {
        async connectedCallback() {
            const content = await loadHTML('components/features-section.html');
            this.innerHTML = content;
        }
    }
    // VideoSection component definition example
    class VideoSection extends HTMLElement {
        async connectedCallback() {
            const content = await loadHTML('components/video-section.html');
            this.innerHTML = content;
        }
    }
    // HeroSection component definition example
    class HeroSection extends HTMLElement {
        async connectedCallback() {
            const content = await loadHTML('components/hero-section.html');
            this.innerHTML = content;
        }
    }

    customElements.define('header-component',HeaderComponent); 
    customElements.define('footer-component',FooterComponent); 
    customElements.define('features-section',FeaturesSection); 
    customElements.define('video-section',VideoSection); 
    customElements.define('hero-section',HeroSection); 

    < End of examples on how to use formats >

    Important notes for JavaScript implementation:
    0. All js is to be written in individual component's js file only. DO NOT make script.js, js/main.js etc.
    1. Always use document.querySelector to query for the elements. Do Not use this.shadowRoot.querySelector or this.querySelector or shadowRoot or      this.attachShadow({ mode: 'open' }); Do not make intersection observers etc for animations. Animations will be added in html files already.
    While writing component's js, always add if conditions and null checks to check if the elements are present or not before proceeding with the code.
    Only write javascript methods for interactive features like toggles, carousel, menubar, etc. Do not add animations using js, use animate css classes to animate things.
    2. In JS files, Do not write code for 3rd party libraries, Use js only for basic dom operations.
    3. Content and animations are to be added in html files only. the JS file is mainly to initialise the web component and very important usecases like mobile menu as that cant be done with html.
    4. Ensure all files are properly linked in the index.html as per the following way:
        <script src="components/header-component.js"></script>
        <script src="components/testimonials-section.js"></script>
        <script src="components/booking-section.js"></script>
        <script src="components/footer-component.js"></script>
      `,
      tools: [codeWriterTool],
      tool_choice: { type: "tool", name: "code_writer_tool" },
      messages: [{ role: "user", content: [{ type: "text", text: query }] }],
    });
    const resp = msg.content.find((content) => content.type === "tool_use");
    console.log("Received response from Anthropic API:", resp);

    const { code, description } = resp.input;

    console.log("recieved code", code);

    // Check if code is not a string, convert it to a string
    const codeString = typeof code === "string" ? code : JSON.stringify(code);

    await saveFile(filePath, codeString);
    await saveFileToS3(filePath, codeString);
    console.log(`Code successfully written to file: ${filePath}`);
    return {
      description,
      status: `Code written successfuly to ${filePath}, You can now proceed to next file`,
    };
  } catch (error) {
    console.error("Error in aiAssistance:", error);
    console.error("Error details:", error.message);
    console.error("Stack trace:", error.stack);
    throw error;
  }
}

module.exports = {
  codeAssitant,
};
