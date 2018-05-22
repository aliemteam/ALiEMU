import * as classNames from 'classnames';
import { observer } from 'mobx-react';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import * as React from 'react';
import ContentLoader, { ContentLoaderProps } from 'react-content-loader';

import { Globals } from 'dashboard/dashboard';
import { displayUnicode } from 'utils/text-utils';
import * as styles from './course-progress-listing.scss';

import Card from 'components/card/';
import RadialProgress from 'components/progress-radial/';

interface Props {
    courseId: number;
    steps_total: number;
    steps_completed: number;
}

declare const AU_Dashboard: Globals;

@observer
export default class CourseProgressListing extends React.Component<Props> {
    fetchResult: IPromiseBasedObservable<LearnDash.Course> = fromPromise(
        fetch(`/wp-json/aliemu/v1/courses/${this.props.courseId}`, {
            headers: { 'X-WP-Nonce': AU_Dashboard.nonce },
        }).then(res => res.json()),
    );

    render(): JSX.Element | null {
        return this.fetchResult.case({
            pending: () => <LoadingListing />,
            rejected: _error => null,
            fulfilled: data => this.renderListing(data),
        });
    }

    private renderListing(data: LearnDash.Course): JSX.Element {
        const title = displayUnicode(data.title.rendered);
        const { steps_total: total, steps_completed: completed } = this.props;
        const isComplete = total === completed;
        return (
            <Card className={styles.listing}>
                <RadialProgress
                    className={styles.icon}
                    diameter={50}
                    thickness={4}
                    max={total}
                    value={completed}
                />
                <a href={data.link} className={styles.title} title={title}>
                    {title}
                </a>
                <div className={styles.details}>
                    <span>
                        {completed} / {total} completed
                    </span>
                    {isComplete &&
                        data._links.certificate &&
                        data._links.certificate[0].href && (
                            <a
                                href={data._links.certificate[0].href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Certificate
                            </a>
                        )}
                </div>
            </Card>
        );
    }
}

const LoadingListing = (props: ContentLoaderProps) => (
    <ContentLoader
        height={75}
        width={475}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
        className={classNames('no-inherit', styles.card)}
        style={{ padding: 0 }}
        {...props}
    >
        <circle cx="37" cy="38" r="30" />
        <rect x="77" y="18" rx="4" ry="4" width="300" height="13" />
        <rect x="77" y="44" rx="4" ry="4" width="110" height="11" />
    </ContentLoader>
);
