import React from 'react';
import renderer from 'react-test-renderer';

import { Intent } from '../../../utils/constants';
import Button from '../button';

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <Button>Primary</Button>
            <Button intent={Intent.SUCCESS}>Success</Button>
            <Button intent={Intent.WARNING}>Warning</Button>
            <Button intent={Intent.DANGER}>Danger</Button>
            <Button isLoading>Loading</Button>
        </>,
    );
    expect(tree).toMatchSnapshot();
});
