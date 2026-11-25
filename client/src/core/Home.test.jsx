/** @vitest-environment jsdom */

import {expect, test, afterEach} from 'vitest';
import {cleanup, render, screen} from '@testing-library/react';

import Home from './Home.jsx';

import unicornbikeImg from '../assets/images/unicornbikeImg.jpg';

// Preparation: Cleanup after each test
afterEach(cleanup);

test('displays the unicorn bike image', () => {
    // Execution
    render(<Home />);

    const image = screen.getByTitle('Unicorn Bike');

    // Assertion
    expect(image.style.backgroundImage).toContain(unicornbikeImg);
});