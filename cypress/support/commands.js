Cypress.Commands.add("login", (login, password) => {
  cy.visit("/login", { failOnStatusCode: false });
  cy.get("[name=login]").type(login);
  cy.get("[name=password]").type(password);
  cy.get("button[type=submit").click();
  //cy.url().should('contain', '/')
});
Cypress.Commands.add("login_with_session", (login, password) => {
  // experimentalSessionAndOrigin must be set to true in e2e configuration
  // with this you can easily switch between users
  cy.session([login, password], () => {
    cy.visit("/login", { failOnStatusCode: false });
    cy.get("[name=login]").type(login);
    cy.get("[name=password]").type(password);
    cy.get("button[type=submit").click();
    cy.url().should("contain", "/");
  });
});

import "cypress-localstorage-commands";
import { Base64 } from "js-base64";

Cypress.Commands.add("login_via_api_call", (callback) => {
  const isAuth = !(
    localStorage.getItem("token") === null ||
    localStorage.getItem("token") === ""
  );

  if (isAuth) {
    callback();
    return;
  }

  cy.request("POST", `${Cypress.env("apiUrl")}/api/v1/auth`, {
    // HINT: Here We read email and password from `.env` file
    email: Cypress.env("email"),
    password: Cypress.env("password"),
  }).then((res) => {
    const data = res.body.data;

    // HINT: Here we write the token to localStorage and make it persistence
    cy.setLocalStorage("token", Base64.btoa(Base64.encode(data.accessToken)));
    cy.saveLocalStorage();
    callback();
  });
});
