import classNames from 'classnames';
import React, { MouseEvent, PureComponent } from 'react';

import styles from './pagination.scss';

import Icon from 'components/icon/';

interface Props {
    value: number;
    total: number;
    size?: number;
    align?: 'left' | 'right' | 'center';
    onChange(e: MouseEvent<HTMLButtonElement>): void;
}

export default class Pagination extends PureComponent<Props> {
    static defaultProps = {
        align: 'right',
    };

    render(): JSX.Element {
        const { align, value, total, onChange, size } = this.props;
        const uid = Date.now().toString();
        const labelId = `pagination-${uid}`;
        const style = {
            height: size || 30,
            minWidth: size || 30,
            fontSize: size ? size / 2 : 15,
        };
        const classname = classNames(styles.nav, {
            [styles.alignRight]: align === 'right',
            [styles.alignLeft]: align === 'left',
            [styles.alignCenter]: align === 'center',
        });
        return (
            <nav
                aria-labelledby={labelId}
                className={classname}
                role="navigation"
            >
                <div className={styles.pager}>
                    <span aria-live="polite" role="status">
                        <h2 className={styles.clipped} id={labelId}>
                            {`Table Pagination - Page ${value}`}
                        </h2>
                    </span>
                    <button
                        aria-label="previous page"
                        className={styles.buttonPrev}
                        data-page={value - 1}
                        disabled={value === 1}
                        style={style}
                        onClick={onChange}
                    >
                        <Icon icon="chevron_left" />
                    </button>
                    <div className={styles.pageList} role="list">
                        {createPageRange(value, total).map(
                            (item, i) =>
                                typeof item === 'number' ? (
                                    <button
                                        key={`page-${item}`}
                                        aria-current={
                                            item === value ? 'page' : undefined
                                        }
                                        aria-label={`page ${item}`}
                                        className={styles.button}
                                        data-page={item}
                                        style={style}
                                        onClick={onChange}
                                    >
                                        {item}
                                    </button>
                                ) : (
                                    <div
                                        key={`ellipse-${i}`}
                                        className={styles.ellipse}
                                        style={style}
                                    >
                                        <Icon icon={item} />
                                    </div>
                                ),
                        )}
                    </div>
                    <button
                        aria-label="next page"
                        className={styles.buttonNext}
                        data-page={value + 1}
                        disabled={value === total}
                        style={style}
                        onClick={onChange}
                    >
                        <Icon icon="chevron_right" />
                    </button>
                </div>
            </nav>
        );
    }
}

type PageRange = Array<number | 'more_horiz'>;

const createPageRange = (current: number, total: number): PageRange => {
    if (total <= 7) {
        return Array.from(new Array(total), (_, i) => i + 1);
    }
    if (current <= 4) {
        return [1, 2, 3, 4, 5, 'more_horiz', total];
    }
    if (total - current <= 3) {
        return [
            1,
            'more_horiz',
            ...Array.from(new Array(5), (_, i) => total - 4 + i),
        ];
    }
    return [
        1,
        'more_horiz',
        current - 1,
        current,
        current + 1,
        'more_horiz',
        total,
    ];
};
