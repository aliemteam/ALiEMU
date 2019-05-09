import React from 'react';
import renderer from 'react-test-renderer';

import Icon from '../';

describe('<Icon />', () => {
    it('should render an accessibility icon', () => {
        const tree = renderer.create(<Icon icon="accessibility" />);
        expect(tree).toMatchSnapshot();
    });
    it('should render an account_circle icon with custom attributes', () => {
        const tree = renderer.create(
            <Icon color="red" icon="account_circle" size={50} />,
        );
        expect(tree).toMatchSnapshot();
    });
});
