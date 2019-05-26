import React from 'react';
import renderer from 'react-test-renderer';

import ButtonOutlined from '../button-outlined';

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <ButtonOutlined>Default</ButtonOutlined>
            <ButtonOutlined intent="success">Success</ButtonOutlined>
            <ButtonOutlined intent="danger">Danger</ButtonOutlined>
        </>,
    );
    expect(tree).toMatchSnapshot();
});
