import React from 'react';
import renderer from 'react-test-renderer';

import DateInput from '../date-input';

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <DateInput value="2018/11/12" />
            <DateInput delimiter="." value="201" />
        </>,
    );
    expect(tree).toMatchSnapshot();
});
