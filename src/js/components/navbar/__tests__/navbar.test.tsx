import React from 'react';
import renderer from 'react-test-renderer';

import { Navbar, NavGroup, NavTab } from '../index';

it('should render correctly', () => {
    const tree = renderer.create(
        <Navbar>
            <NavGroup>
                <NavTab active>One</NavTab>
                <NavTab>Two</NavTab>
            </NavGroup>
            <NavGroup align="right">
                <NavTab>Three</NavTab>
            </NavGroup>
        </Navbar>,
    );
    expect(tree).toMatchSnapshot();
});
