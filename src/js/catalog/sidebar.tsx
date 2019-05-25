import { memo } from '@wordpress/element';

import { Menu, MenuGroup, MenuItemRadio } from 'components/menu';

import { Duration } from './index';
import styles from './sidebar.scss';

interface Props {
    categories: Record<number, string>;
    selectedCategory: number;
    selectedDuration: Duration;
    onCategoryChange(id: number): void;
    onDurationChange(duration: Duration): void;
}

function Sidebar({
    categories,
    selectedDuration,
    selectedCategory,
    onCategoryChange,
    onDurationChange,
}: Props) {
    return (
        <div className={styles.sidebar}>
            <div className={styles.sticky}>
                <Menu aria-controls="content">
                    <MenuGroup heading="Category">
                        {[...Object.entries(categories)].map(([id, name]) => (
                            <MenuItemRadio
                                key={id}
                                isActive={`${selectedCategory}` === id}
                                onClick={() =>
                                    onCategoryChange(parseInt(id, 10) || 0)
                                }
                            >
                                {name}
                            </MenuItemRadio>
                        ))}
                    </MenuGroup>
                    <MenuGroup heading="Duration">
                        <MenuItemRadio
                            isActive={
                                selectedDuration === Duration.LESS_THAN_TWO
                            }
                            onClick={() =>
                                onDurationChange(Duration.LESS_THAN_TWO)
                            }
                        >
                            {'< 2 hours'}
                        </MenuItemRadio>
                        <MenuItemRadio
                            isActive={selectedDuration === Duration.TWO_TO_FOUR}
                            onClick={() =>
                                onDurationChange(Duration.TWO_TO_FOUR)
                            }
                        >
                            {'2-4 hours'}
                        </MenuItemRadio>
                        <MenuItemRadio
                            isActive={
                                selectedDuration === Duration.FOUR_OR_MORE
                            }
                            onClick={() =>
                                onDurationChange(Duration.FOUR_OR_MORE)
                            }
                        >
                            {'4+ hours'}
                        </MenuItemRadio>
                    </MenuGroup>
                </Menu>
            </div>
        </div>
    );
}

export default memo(Sidebar, (prevProps, nextProps) => {
    return (
        prevProps.selectedCategory === nextProps.selectedCategory &&
        prevProps.selectedDuration === nextProps.selectedDuration
    );
});
