import classNames from 'classnames';
import { observer } from 'mobx-react';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import React from 'react';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

import { Course } from 'utils/types';

import { Courses } from 'utils/api';
import { displayUnicode } from 'utils/text-utils';
import styles from './course-progress-listing.scss';

import Card from 'components/card/';
import RadialProgress from 'components/progress-radial/';

interface Props {
    courseId: number;
    steps_total: number;
    steps_completed: number;
}

@observer
export default class CourseProgressListing extends React.Component<Props> {
    fetchResult: IPromiseBasedObservable<Course> = fromPromise(
        Courses.fetchOne(this.props.courseId),
    );

    render(): JSX.Element | null {
        return this.fetchResult.case({
            pending: () => <LoadingListing />,
            rejected: _error => null,
            fulfilled: data => this.renderListing(data),
        });
    }

    private renderListing(data: Course): JSX.Element {
        const title = displayUnicode(data.title.rendered);
        const { steps_total: total, steps_completed: completed } = this.props;
        const isComplete = total === completed;
        return (
            <Card className={styles.listing}>
                <RadialProgress
                    className={styles.icon}
                    diameter={50}
                    max={total}
                    thickness={4}
                    value={completed}
                />
                <a className={styles.title} href={data.link} title={title}>
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
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Certificate
                            </a>
                        )}
                </div>
            </Card>
        );
    }
}

const LoadingListing = (props: IContentLoaderProps) => (
    <ContentLoader
        className={classNames('no-inherit', styles.card)}
        height={75}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
        speed={2}
        style={{ padding: 0 }}
        width={475}
        {...props}
    >
        <circle cx="37" cy="38" r="30" />
        <rect height="13" rx="4" ry="4" width="300" x="77" y="18" />
        <rect height="11" rx="4" ry="4" width="110" x="77" y="44" />
    </ContentLoader>
);
