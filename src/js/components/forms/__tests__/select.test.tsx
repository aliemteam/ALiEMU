import React from 'react';
import renderer from 'react-test-renderer';

import Select from '../select';

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
            <Select disabled label="Disabled Label Select">
                <option>Foo</option>
                <option>Bar</option>
                <option>Baz</option>
            </Select>
        </>,
    );
    expect(tree).toMatchSnapshot();
});
