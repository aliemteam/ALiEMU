import classNames from 'classnames';
import { observer } from 'mobx-react';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import React from 'react';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

import { ICourse } from 'utils/types';

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
    fetchResult: IPromiseBasedObservable<ICourse> = fromPromise(
        Courses.fetchOne(this.props.courseId),
    );

    render(): JSX.Element | null {
        return this.fetchResult.case({
            pending: () => <LoadingListing />,
            rejected: _error => null,
            fulfilled: data => this.renderListing(data),
        });
    }

    private renderListing(data: ICourse): JSX.Element {
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

const LoadingListing = (props: IContentLoaderProps) => (
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
