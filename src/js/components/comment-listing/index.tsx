import { memo, useEffect, useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import classNames from 'classnames';
import { formatDistance } from 'date-fns';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';
import striptags from 'striptags';

import { Comments } from 'utils/api';
import styles from './comment-listing.scss';

import Card from 'components/card';

interface Props {
    commentId: number;
}

function CommentListing({ commentId }: Props) {
    const [comment, setComment] = useState<Comments.Comment | null>(null);
    useEffect(() => {
        Comments.fetchOne(commentId, { _embed: true }).then(c => setComment(c));
    }, [commentId]);
    if (!comment) {
        return <LoadingListing />;
    }
    const content = striptags(decodeEntities(comment.content.rendered));
    return (
        <Card className={styles.listing}>
            <h3 className={styles.title}>
                <a href={comment._embedded.up[0].link}>
                    {decodeEntities(comment._embedded.up[0].title.rendered)}
                </a>
            </h3>
            <a className={styles.date} href={comment.link}>
                {formatDistance(new Date(comment.date_gmt), new Date(), {
                    addSuffix: true,
                })}
            </a>
            <div className={styles.comment}>
                <div className={styles.lineClamp}>
                    {content.length > 250
                        ? `${content.slice(0, 250)}…`
                        : content}
                </div>
            </div>
        </Card>
    );
}

export default memo(CommentListing);

const LoadingListing = (props: IContentLoaderProps) => (
    <ContentLoader
        className={classNames('no-inherit', styles.card)}
        height={100}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
        speed={2}
        style={{ padding: 0 }}
        width={475}
        {...props}
    >
        <rect height="10.5" rx="3" ry="3" width="115.5" x="14" y="15" />
        <rect height="10.5" rx="3" ry="3" width="165" x="146" y="15" />
        <rect height="10.5" rx="3" ry="3" width="132" x="328" y="15" />
        <rect height="10.5" rx="3" ry="3" width="215" x="14" y="36" />
        <rect height="10.5" rx="3" ry="3" width="215" x="245" y="36" />
        <rect height="10.5" rx="3" ry="3" width="149" x="14" y="57" />
        <rect height="10.5" rx="3" ry="3" width="99" x="179.06" y="57" />
        <rect height="10.5" rx="3" ry="3" width="165" x="295" y="57" />
        <rect height="10.5" rx="3" ry="3" width="190" x="14" y="78" />
        <rect height="10.5" rx="3" ry="3" width="240" x="220" y="78" />
    </ContentLoader>
);
