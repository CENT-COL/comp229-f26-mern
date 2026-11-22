// Use jsdom to give this test a simulated browser environment.
/** @vitest-environment jsdom */
// Import Vitest's test function, assertions, and after-test hook.
import { afterEach, expect, test } from 'vitest'
// Import helpers to render components, find elements, and clean up afterward.
import { cleanup, render, screen } from '@testing-library/react'
// Import the actual component we want to test.
import Home from './Home.jsx'
// Import the image so we can check that the component uses it.
import unicornbikeImg from '../assets/images/unicornbikeImg.jpg'

// Remove rendered components after each test so tests do not affect one another.
afterEach(cleanup)

// Give the test a descriptive name and provide the function that runs it.
test('displays the unicorn bike image', () => {
  // Render the Home component in the simulated browser.
  render(<Home />)

  // Find the image by its title; the test fails if it cannot be found.
  const image = screen.getByTitle('Unicorn Bike')

  // CardMedia displays the image as a CSS background rather than an img element.
  expect(image.style.backgroundImage).toContain(unicornbikeImg)
})
