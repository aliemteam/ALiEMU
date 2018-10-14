import React, { MouseEvent, PureComponent } from 'react';

import styles from './sidebar.scss';

import Menu from 'components/menu';
import MenuDivider from 'components/menu/divider';
import MenuItem from 'components/menu/item';
import { CatalogGlobals } from './';

declare const AU_Catalog: CatalogGlobals;

export const enum Duration {
    NONE = '',
    LESS_THAN_TWO = '< 2',
    TWO_TO_FOUR = '2 - 4',
    FOUR_OR_MORE = '4+',
}

interface Props {
    category: number;
    duration: Duration;
    onCategoryChange(cid: number): void;
    onDurationChange(duration: Duration): void;
}

export default class Sidebar extends PureComponent<Props> {
    static readonly categories: ReadonlyMap<number, string> = new Map(
        [...Object.entries(AU_Catalog.categories)].map(
            ([id, name]) => [parseInt(id, 10), name] as [number, string],
        ),
    );

    handleCategoryClick = (e: MouseEvent<HTMLButtonElement>): void => {
        const id = parseInt(e.currentTarget.id, 10);
        const newId =
            this.props.category !== id
                ? Sidebar.categories.has(id)
                    ? id
                    : 0
                : 0;
        return this.props.onCategoryChange(newId);
    };

    handleDurationClick = (e: MouseEvent<HTMLButtonElement>): void => {
        const selection = e.currentTarget.dataset.duration as
            | Duration
            | undefined;
        this.props.onDurationChange(
            selection && selection !== this.props.duration
                ? selection
                : Duration.NONE,
        );
    };

    render(): JSX.Element {
        let uid = Date.now();
        return (
            <div className={styles.sidebar}>
                <div className={styles.sticky}>
                    <Menu role="group" aria-labelledby={`${uid}`}>
                        <MenuDivider title="Category" id={`${uid++}`} />
                        {[...Sidebar.categories.entries()].map(([id, name]) => (
                            <MenuItem
                                key={id}
                                id={id.toString()}
                                onClick={this.handleCategoryClick}
                                selected={this.props.category === id}
                            >
                                {name}
                            </MenuItem>
                        ))}
                    </Menu>
                    <Menu role="group" aria-labelledby={`${uid}`}>
                        <MenuDivider title="Duration" id={`${uid++}`} />
                        <MenuItem
                            selected={
                                this.props.duration === Duration.LESS_THAN_TWO
                            }
                            data-duration={Duration.LESS_THAN_TWO}
                            onClick={this.handleDurationClick}
                        >
                            {'< 2 hours'}
                        </MenuItem>
                        <MenuItem
                            selected={
                                this.props.duration === Duration.TWO_TO_FOUR
                            }
                            data-duration={Duration.TWO_TO_FOUR}
                            onClick={this.handleDurationClick}
                        >
                            {'2-4 hours'}
                        </MenuItem>
                        <MenuItem
                            selected={
                                this.props.duration === Duration.FOUR_OR_MORE
                            }
                            data-duration={Duration.FOUR_OR_MORE}
                            onClick={this.handleDurationClick}
                        >
                            {'4+ hours'}
                        </MenuItem>
                    </Menu>
                </div>
            </div>
        );
    }
}
