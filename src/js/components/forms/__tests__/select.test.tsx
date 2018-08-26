import React from 'react';
import renderer from 'react-test-renderer';

import Select from '../select';

// tslint:disable:react-a11y-role-has-required-aria-props

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <Select>
                <option>Foo</option>
                <option>Bar</option>
                <option>Baz</option>
            </Select>
            <Select label="Labelled Select">
                <option>Foo</option>
                <option>Bar</option>
                <option>Baz</option>
            </Select>
            <Select label="Disabled Label Select" disabled>
                <option>Foo</option>
                <option>Bar</option>
                <option>Baz</option>
            </Select>
        </>,
    );
    expect(tree).toMatchSnapshot();
});
