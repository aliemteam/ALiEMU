import { memo, useContext, useMemo, useState } from '@wordpress/element';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import AnchorButton from 'components/buttons/anchor-button';
import Card from 'components/card';
import CommentListing from 'components/comment-listing';
import { SectionHeading } from 'components/typography/headings';

import { DashboardContext } from '../../dashboard';
import styles from './tab-profile.scss';

function TabProfile() {
    const [visibleCommentRows, setVisibleCommentRows] = useState(3);
    const { user, recentComments } = useContext(DashboardContext);

    const comments = useMemo(
        () =>
            recentComments
                .slice(0, visibleCommentRows)
                .map(id => <CommentListing key={id} commentId={id} />),
        [recentComments, visibleCommentRows],
    );

    return (
        <div className={styles.profile}>
            {user.description && (
                <div className={styles.bio}>
                    <SectionHeading>Bio</SectionHeading>
                    <Card>{user.description}</Card>
                </div>
            )}
            <div className={styles.stats}>
                <SectionHeading>Stats</SectionHeading>
                <Card>
                    Member since: {dayjs(dayjs(user.registered_date)).fromNow()}
                </Card>
            </div>
            {recentComments.length > 0 && (
                <div className={styles.comments}>
                    <SectionHeading>Recent Comments</SectionHeading>
                    {comments}
                    {recentComments.length > visibleCommentRows && (
                        <AnchorButton
                            className={styles.viewMore}
                            onClick={() =>
                                setVisibleCommentRows(visibleCommentRows + 3)
                            }
                        >
                            View more
                        </AnchorButton>
                    )}
                </div>
            )}
        </div>
    );
}
export default memo(TabProfile);
