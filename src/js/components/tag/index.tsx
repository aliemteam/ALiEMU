import { memo } from '@wordpress/element';

import Icon from 'components/icon';

import styles from './tag.scss';

interface Props {
    text: string;
    onClick?(tag: string): void;
    onRemove?(tag: string): void;
}
function Tag({ text, onClick, onRemove }: Props) {
    return (
        <div
            className={styles.tag}
            role="button"
            tabIndex={onClick ? 0 : -1}
            onClick={() => onClick && onClick(text)}
            onKeyDown={e => {
                if (onClick && ['Enter', ' '].includes(e.key)) {
                    e.preventDefault();
                    onClick(text);
                }
            }}
        >
            <span>{text}</span>
            {onRemove && (
                <button
                    aria-label={`remove tag ${text}`}
                    className={styles.removeBtn}
                    onClick={() => onRemove(text)}
                >
                    <Icon icon="close" size={12} />
                </button>
            )}
        </div>
    );
}
export default memo(Tag);
