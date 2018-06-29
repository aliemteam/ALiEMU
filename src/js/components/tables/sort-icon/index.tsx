import classNames from 'classnames';
import React from 'react';

import { SortOrder } from 'components/tables/base';
import styles from './sort-icon.scss';

interface Props {
    order: SortOrder;
    size?: number;
    active?: boolean;
    children?: never;
}

export default class SortIcon extends React.PureComponent<Props> {
    static defaultProps = {
        size: 10,
    };
    render(): JSX.Element {
        const { active, order, size } = this.props;
        const classname = classNames(styles.icon, {
            [styles.active]: active,
            [styles.asc]: order === SortOrder.ASC,
            [styles.desc]: order === SortOrder.DESC,
        });
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width={size}
                height={size}
                viewBox="0 0 25 25"
                className={classname}
            >
                <polygon points="10 0, 20 10, 0 10" />
                <polygon points="10 25, 20 15, 0 15" />
            </svg>
        );
    }
}
