describe("Login and visit profile page (as user and as admin)", () => {
  beforeEach(() => {
    localStorage.setItem("access-token", "access-token");
    localStorage.setItem("client", "headers.client");
    localStorage.setItem("uid", "headers.uid");
    localStorage.setItem("token-type", "headers[token-type]");

    cy.intercept("POST", "/api/v1/auth/sign_in*", {
      fixture: "login_user.json",
    }).as("getUser"); // login

    cy.intercept("GET", "/api/v1/me?locale=en", { fixture: "me_user.json" }).as(
      "getMeUser"
    ); // me
    // cy.intercept({
    //   method: 'GET',
    //   url: '/api/v1/me*',

    // }).as('getMEEE')

    // cy.intercept('OPTIONS', '/api/v1/me*', {
    //   statusCode: 201,
    //   body: {
    //     name: 'Peter Pan',
    //   }}).as('getMeOptionsUser') // me
    cy.intercept("GET", "/api/v1/maps/*", { fixture: "maps.json" }).as(
      "getMaps"
    ); // and assign an alias
    cy.intercept("DELETE", "*api/v1/auth/sign_out*", {
      statusCode: 201,
      body: {
        name: "Peter Pan",
      },
    }).as("getLogout"); // and assign an alias
    // cy.intercept('OPTIONS', '/api/v1/auth*', {
    //   statusCode: 201,
    //   body: {
    //     name: 'Peter Pan',
    //   }},).as('getLogoutOption') // me

    cy.visit(Cypress.env("baseUrl"));
  });

  it("Login as user, visit profile, logout", () => {
    cy.login("user@domain.org", "123456789");
    cy.wait("@getUser").then((interception) => {
      assert.isNotNull(interception.response.body, "getUser API call has data");
    });
    // cy.wait('@getMeUser').then((interception) => {
    //   assert.isNotNull(interception.response.body, 'getMeUser API call has data')
    // })

    cy.visit("/profile", { failOnStatusCode: false });
    cy.get("input[name=email]").should("have.value", "user@domain.org");
    cy.get(".v-app-bar__nav-icon").click();
    cy.get("#logout").click();
    cy.wait("@getLogout");
    cy.url().should("include", "/");
  });

  // it('Login as admin, visit profile, logout', () => {
  //   cy.intercept('POST', '/api/v1/auth/sign_in*', { fixture: 'login_admin.json' }).as('getAdmin') // login
  //   cy.intercept('GET', '/api/v1/me*', { fixture: 'me_admin.json' }).as('getMeAdmin') // me
  //   cy.login('admin@domain.org', '123456789')
  //   cy.wait('@getAdmin').then((interception) => {
  //     assert.isNotNull(interception.response.body, 'getAdmin API call has data')
  //   })
  //   cy.wait('@getMeAdmin').then((interception) => {
  //     assert.isNotNull(interception.response.body, 'getMeAdmin API call has data')
  //   })

  //   cy.visit('/profile')
  //   cy.get('input[name=email]').should('have.value', 'admin@domain.org')
  //   cy.get('.v-app-bar__nav-icon').click()
  //   cy.get('#logout').click()
  //   cy.url().should('include', '/')
  // })
});
