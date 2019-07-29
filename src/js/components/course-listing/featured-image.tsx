import Placeholder from '../../../assets/aliemu-placeholder.svg';

import styles from './featured-image.scss';

interface Props {
    id: number;
    url?: string;
}

export default function FeaturedImage({ id, url }: Props) {
    if (url) {
        return (
            <div
                className={styles.image}
                style={{
                    backgroundImage: `url(${url})`,
                    backgroundSize: 'cover',
                }}
            >
                <div
                    className={styles.overlay}
                    style={{
                        filter: `hue-rotate(${id}deg)`,
                    }}
                />
            </div>
        );
    }
    return (
        <Placeholder
            className={styles.image}
            style={{
                filter: `hue-rotate(${id}deg)`,
            }}
        />
    );
}
