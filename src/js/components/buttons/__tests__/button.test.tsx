import React from 'react';
import renderer from 'react-test-renderer';

import Button from '../button';

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <Button>Primary</Button>
            <Button intent="success">Success</Button>
            <Button intent="warning">Warning</Button>
            <Button intent="danger">Danger</Button>
            <Button isLoading>Loading</Button>
        </>,
    );
    expect(tree).toMatchSnapshot();
});
