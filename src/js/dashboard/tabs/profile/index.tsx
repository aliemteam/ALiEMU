import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

import UserStore from 'dashboard/user-store';
import styles from './tab-profile.scss';

import { AnchorButton } from 'components/buttons/';
import Card from 'components/card/';
import CommentListing from 'components/comment-listing/';
import { SectionHeading } from 'components/typography/';

interface Props {
    store: UserStore;
}

@observer
export default class TabProfile extends React.Component<Props> {
    @observable visibleCommentRows = 3;

    private readonly recentComments = [];

    render(): JSX.Element {
        const { user } = this.props.store;
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
                        Member since:{' '}
                        {distanceInWordsToNow(new Date(user.registered_date), {
                            addSuffix: true,
                        })}
                    </Card>
                </div>
                {this.recentComments.length > 0 && (
                    <div className={styles.comments}>
                        <SectionHeading>Recent Comments</SectionHeading>
                        {this.recentComments
                            .slice(0, this.visibleCommentRows)
                            .map(id => (
                                <CommentListing key={id} commentId={id} />
                            ))}
                        {this.recentComments.length >
                            this.visibleCommentRows && (
                            <AnchorButton
                                className={styles.viewMore}
                                onClick={this.addCommentRows}
                            >
                                View more
                            </AnchorButton>
                        )}
                    </div>
                )}
            </div>
        );
    }

    @action
    private addCommentRows = () => {
        this.visibleCommentRows += 3;
    };
}
