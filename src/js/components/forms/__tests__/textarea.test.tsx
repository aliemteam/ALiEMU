import React from 'react';
import renderer from 'react-test-renderer';

import Textarea from '../textarea';

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <Textarea />
            <Textarea label="Labelled Textarea" />
            <Textarea disabled label="Labelled Disabled Textarea" />
            <Textarea defaultValue="12345" maxLength={10} />
            <Textarea
                label="Labelled with maxlength"
                defaultValue="12345"
                maxLength={10}
            />
        </>,
    );
    expect(tree).toMatchSnapshot();
});
