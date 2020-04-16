import React from 'react';
import Bioeditor from './bioeditor';
import { render, waitForElement } from '@testing-library/react';
import axios from './axioscopy';

jest.mock('./axioscopy');

test('onMount add button is rendered if no bio', async() => {

    const { container } = render(<Bioeditor
        id = '1'
        first = 'jack'

    /> );

    await waitForElement(() => container.querySelector('div'));
    console.log('innerHTML:', container.innerHTML);

    expect(container.innerHTML).toContain('addBioButton');
});

test('onMount edit button is rendered if bio exists', async() => {

    const { container } = render(<Bioeditor
        id = '1'
        first = 'jack'
        bio = 'Hi Im Jack I am learning to code'

    /> );

    await waitForElement(() => container.querySelector('div'));
    console.log('innerHTML:', container.innerHTML);

    expect(container.innerHTML).toContain('edit');
});

test('if edit or add button are clicked Text Area and a save button are rendered', async() => {

    const handleClick = jest.fn();
    const { container } = render (<Bioeditor


        handleClick= { handleClick } /> );


    const img = container.querySelector('className="addBioButton"');
    fireEvent.click(img);
    expect(
        handleClick.mock.calls.length

    ).toBe(1);


})
