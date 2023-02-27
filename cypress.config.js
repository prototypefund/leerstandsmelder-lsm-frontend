const { defineConfig } = require("cypress");

require("dotenv-extended").load();

module.exports = defineConfig({
  env: {
    // HINT: here we read these keys from .env file, feel free to remove the items that you don't need
    baseUrl: process.env.CYPRESS_BASE_URL,
    apiUrl: process.env.VITE_API_URL,
    email: process.env.CYPRESS_EMAIL,
    password: process.env.CYPRESS_PASSWORD,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: process.env.CYPRESS_BASE_URL,
    experimentalSessionAndOrigin: true,
    screenshotsFolder: "cypress/results/screenshots",
    videosFolder: "cypress/results/videos",
    supportFile: "cypress/support/commands.js",
    defaultCommandTimeout: 5500,
    responseTimeout: 50000,
    video: false,
    experimentalStudio: true,
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      reporterEnabled: "mochawesome",
      mochawesomeReporterOptions: {
        reportDir: "cypress/results/json",
        overwrite: false,
        html: false,
        json: true,
        timestamp: "mm-dd-yyyy_HHMMss",
      },
    },
  },

  component: {
    devServer: {
      framework: "vue-cli",
      bundler: "webpack",
    },
  },
});
