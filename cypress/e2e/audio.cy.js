describe('Audio Player', () => {
  it('plays audio', () => {
    cy.visit('/')

    cy.get('.composition-name:last').click()
    cy.wait(350)
    cy.get('#play-btn').click()

    cy.wait(15000)

    cy.get('#player-play-btn').click()
  })
})
