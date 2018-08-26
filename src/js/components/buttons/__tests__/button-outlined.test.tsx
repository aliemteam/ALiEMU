import React from 'react';
import renderer from 'react-test-renderer';

import { Intent } from '../../../utils/constants';
import ButtonOutlined from '../button-outlined';

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <ButtonOutlined>Default</ButtonOutlined>
            <ButtonOutlined intent={Intent.SUCCESS}>Success</ButtonOutlined>
            <ButtonOutlined intent={Intent.DANGER}>Danger</ButtonOutlined>
        </>,
    );
    expect(tree).toMatchSnapshot();
});
