import { memo, useMemo } from '@wordpress/element';
import classNames from 'classnames';
import { uniqueId } from 'lodash';

import Icon from 'components/icon';

import styles from './pagination.scss';

interface Props {
    align?: 'left' | 'right' | 'center';
    size?: number;
    total: number;
    value: number;
    onChange(page: number): void;
}
function Pagination({
    align = 'right',
    size = 30,
    total,
    value,
    onChange,
}: Props) {
    const id = uniqueId('pagination-');
    const style = {
        height: size,
        minWidth: size,
        fontSize: size / 2,
    };
    const classname = classNames(styles.nav, {
        [styles.alignRight]: align === 'right',
        [styles.alignLeft]: align === 'left',
        [styles.alignCenter]: align === 'center',
    });
    const pageRange = useMemo(() => createPageRange(value, total), [
        value,
        total,
    ]);
    return (
        <nav aria-labelledby={id} className={classname} role="navigation">
            <div className={styles.pager}>
                <span aria-live="polite" role="status">
                    <h2 className={styles.clipped} id={id}>
                        {`Table Pagination - Page ${value}`}
                    </h2>
                </span>
                <button
                    aria-label="previous page"
                    className={styles.buttonPrev}
                    disabled={value === 1}
                    style={style}
                    onClick={() => onChange(value - 1)}
                >
                    <Icon icon="chevron_left" />
                </button>
                <div className={styles.pageList} role="list">
                    {pageRange.map((item, i) =>
                        item !== -1 ? (
                            <button
                                key={`page-${item}`}
                                aria-current={
                                    item === value ? 'page' : undefined
                                }
                                aria-label={`page ${item}`}
                                className={styles.button}
                                style={style}
                                onClick={() => onChange(item)}
                            >
                                {item}
                            </button>
                        ) : (
                            <div
                                key={`ellipse-${i}`}
                                className={styles.ellipse}
                                style={style}
                            >
                                <Icon icon="more_horiz" />
                            </div>
                        ),
                    )}
                </div>
                <button
                    aria-label="next page"
                    className={styles.buttonNext}
                    disabled={value === total}
                    style={style}
                    onClick={() => onChange(value + 1)}
                >
                    <Icon icon="chevron_right" />
                </button>
            </div>
        </nav>
    );
}
export default memo(Pagination);

function createPageRange(current: number, total: number) {
    const ELLIPSE = -1;
    if (total <= 7) {
        return Array.from(new Array(total), (_, i) => i + 1);
    }
    if (current <= 4) {
        return [1, 2, 3, 4, 5, ELLIPSE, total];
    }
    if (total - current <= 3) {
        return [
            1,
            ELLIPSE,
            ...Array.from(new Array(5), (_, i) => total - 4 + i),
        ];
    }
    return [1, ELLIPSE, current - 1, current, current + 1, ELLIPSE, total];
}
