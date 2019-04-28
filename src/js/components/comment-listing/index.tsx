import classNames from 'classnames';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import React, { useEffect, useState } from 'react';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';
import striptags from 'striptags';

import { Comments } from 'utils/api';
import { displayUnicode } from 'utils/text-utils';
import styles from './comment-listing.scss';

import Card from 'components/card/';

interface Props {
    commentId: number;
}

export default function CommentListing({ commentId }: Props) {
    const [comment, setComment] = useState<WordPress.Comment | null>(null);
    useEffect(() => {
        Comments.fetchOne(commentId, { _embed: true }).then(c => setComment(c));
    }, [commentId]);
    if (!comment) {
        return <LoadingListing />;
    }
    const content = striptags(displayUnicode(comment.content.rendered));
    return (
        <Card className={styles.listing}>
            <h3 className={styles.title}>
                <a href={comment._embedded.up[0].link}>
                    {displayUnicode(comment._embedded.up[0].title.rendered)}
                </a>
            </h3>
            <a className={styles.date} href={comment.link}>
                {distanceInWordsToNow(comment.date_gmt, {
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

const LoadingListing = (props: IContentLoaderProps) => (
    <ContentLoader
        height={100}
        width={475}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
        className={classNames('no-inherit', styles.card)}
        style={{ padding: 0 }}
        {...props}
    >
        <rect x="14" y="15" rx="3" ry="3" width="115.5" height="10.5" />
        <rect x="146" y="15" rx="3" ry="3" width="165" height="10.5" />
        <rect x="328" y="15" rx="3" ry="3" width="132" height="10.5" />
        <rect x="14" y="36" rx="3" ry="3" width="215" height="10.5" />
        <rect x="245" y="36" rx="3" ry="3" width="215" height="10.5" />
        <rect x="14" y="57" rx="3" ry="3" width="149" height="10.5" />
        <rect x="179.06" y="57" rx="3" ry="3" width="99" height="10.5" />
        <rect x="295" y="57" rx="3" ry="3" width="165" height="10.5" />
        <rect x="14" y="78" rx="3" ry="3" width="190" height="10.5" />
        <rect x="220" y="78" rx="3" ry="3" width="240" height="10.5" />
    </ContentLoader>
);
