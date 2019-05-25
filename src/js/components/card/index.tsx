import { memo, HTMLProps } from '@wordpress/element';
import classNames from 'classnames';

import styles from './card.scss';

type Props = HTMLProps<HTMLDivElement>;

function Card({ children, className, ...props }: Props) {
    const classname = classNames(styles.card, className);
    return (
        <div {...props} className={classname}>
            {children}
        </div>
    );
}
export default memo(Card);
