import React from 'react';
import renderer from 'react-test-renderer';

import { Navbar, NavGroup, NavTab } from '../index';

const noOp = () => void 0;

it('should render correctly', () => {
    const tree = renderer.create(
        <Navbar>
            <NavGroup>
                <NavTab active onClick={noOp}>
                    One
                </NavTab>
                <NavTab onClick={noOp}>Two</NavTab>
            </NavGroup>
            <NavGroup align="right">
                <NavTab onClick={noOp}>Three</NavTab>
            </NavGroup>
        </Navbar>,
    );
    expect(tree).toMatchSnapshot();
});
