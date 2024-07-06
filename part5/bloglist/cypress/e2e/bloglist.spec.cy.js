describe("bloglist", function() {
  beforeEach(function() {
    cy.visit("http://localhost:5173/");
  });

  it("login form is shown", function() {
    cy.contains("username");
    cy.contains("password");
  });

  describe("Login", function() {
    it("succeeds with correct credentials", function() {
      cy.get(".username").type("testuser_unique");
      cy.get(".password").type("testpassword");
      cy.get(".login").click();
    });

    it("fails with wrong credentials", function() {
      cy.get('.username').type('testuser_unique');
      cy.get('.password').type('wrong');
      cy.get('.login').click();
      cy.get('.error').contains('invalid user name or password');
    });
  });

  describe("when logged in", function() {
    beforeEach(function() {
      cy.get(".username").type("testuser_unique");
      cy.get(".password").type("testpassword");
      cy.get(".login").click();
      cy.contains("one"); 
    });

    it("a blog can be created", function() {
      cy.contains("create new blog").click();
      cy.get(".title").type("test title two");
      cy.get(".author").type("test author");
      cy.get(".url").type("http://youtube.com");
      cy.get(".create-button").click();
      cy.contains("test title two");
    });

    it("user can add likes", function() {
      cy.contains("view").click();
      cy.get(".likes").click();
      cy.contains("1");
    });

    it("user can delete their blog", function() {
      cy.contains("view").click();
      cy.get(".remove").click();
      cy.contains(".remove").should("not.exist");
      cy.get('.logout').should('exist').click();
    });
  });

  describe("when users are more than one", function() {
    beforeEach(function() {
      cy.get(".username").type("testusertwo_unique");
      cy.get(".password").type("numbertwo");
      cy.get(".login").click(); 
    });

    it("only user who created the blog can delete it", function() {
      cy.contains('create new blog').click();
      cy.get('.title').type('test title two');
      cy.get('.author').type('test author two');
      cy.get('.url').type('http://testurltwo.com');
      cy.get('.create-button').click();
      cy.contains('test author two');
      cy.get('.logout').click(); 
      cy.get('.username').type('testuser_unique');
      cy.get('.password').type('testpassword');
      cy.get('.login').click(); 
      cy.contains('view').click();
      cy.contains('remove').should('not.exist');
    });

    it("blogs are ordered by likes", function() {
      cy.contains('create new blog').click();
      cy.get('.title').type('The title with most likes');
      cy.get('.author').type('kkkk');
      cy.get('.url').type('https://www.kkkk.com');
      cy.get('.create-button').click();

      cy.contains('create new blog').click();
      cy.get('.title').type('The title with the second most likes');
      cy.get('.author').type('gggg');
      cy.get('.url').type('https://www.gggg.com');
      cy.get('.create-button').click();

      cy.contains("test title two")
      cy.contains("view").click();
      cy.contains("button", "likes").click();


      cy.get(".blog").eq(0).should("contain", "test title two ");
    }); 
  }); 
}); 
  