import React from 'react';
import renderer from 'react-test-renderer';

import MenuDivider from '../divider';
import Menu from '../index';
import MenuItem from '../item';

it('should render correctly', () => {
    const tree = renderer.create(
        <Menu>
            <MenuDivider title="Testing" />
            <MenuItem>One</MenuItem>
            <MenuItem selected>Two</MenuItem>
            <MenuItem>Three</MenuItem>
            <MenuDivider />
            <MenuItem>Four</MenuItem>
        </Menu>,
    );
    expect(tree).toMatchSnapshot();
});
