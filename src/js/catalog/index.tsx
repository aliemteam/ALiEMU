import { action, computed, flow, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component, FormEvent } from 'react';

import { Courses } from 'utils/api';
import { Course } from 'utils/types';

import CourseListing from 'components/course-listing/';
import Input from 'components/forms/input';
import Sidebar, { Duration } from './sidebar';

import styles from './catalog.scss';

export type CourseSubset = Pick<
    Course,
    | 'categories'
    | 'description'
    | 'date_gmt'
    | 'featured_media'
    | 'id'
    | 'link'
    | 'hours'
    | 'title'
    > & { _embedded: { [k: string]: any } }; // eslint-disable-line

export interface CatalogGlobals {
    categories: {
        [categoryId: string]: string;
    };
    courses: CourseSubset[];
    headers: {
        [k in keyof Omit<CatalogGlobals, 'headers'>]: WordPress.API.Headers
    };
}

interface DurationObj {
    min: number;
    max: number;
}

declare const AU_Catalog: CatalogGlobals;

@observer
export default class Catalog extends Component {
    @observable filterText = '';
    @observable categorySelection: number = 0;
    @observable durationSelection: Duration = Duration.NONE;

    fetchCourses = flow(function*(this: Catalog) {
        const courses: CourseSubset[] = yield Courses.fetchMany(
            {
                _fields: [
                    '_links',
                    'categories',
                    'description',
                    'date_gmt',
                    'featured_media',
                    'id',
                    'link',
                    'hours',
                    'title',
                ],
            },
            2,
        );
        this._courses.push(...courses);
    }).bind(this);

    private _courses = observable([...AU_Catalog.courses], { deep: false });

    componentDidMount(): void {
        this.fetchCourses();
    }

    @computed
    get courses(): CourseSubset[] {
        return this._courses.filter(course => {
            if (
                this.categorySelection !== 0 &&
                !course.categories.includes(this.categorySelection)
            ) {
                return false;
            }

            if (
                this.filterText.length &&
                `${course.title} ${course.description}`
                    .toLowerCase()
                    .indexOf(this.filterText.toLowerCase()) === -1
            ) {
                return false;
            }

            if (this.durationSelection !== Duration.NONE) {
                const duration = course.hours;
                switch (this.durationSelection) {
                    case Duration.LESS_THAN_TWO:
                        return duration < 2;
                    case Duration.TWO_TO_FOUR:
                        return 2 <= duration && duration < 4;
                    case Duration.FOUR_OR_MORE:
                        return duration >= 4;
                }
            }
            return true;
        });
    }

    @computed
    get duration(): DurationObj {
        switch (this.durationSelection) {
            case Duration.LESS_THAN_TWO:
                return { min: 0, max: 2 };
            case Duration.TWO_TO_FOUR:
                return { min: 2, max: 4 };
            case Duration.FOUR_OR_MORE:
                return { min: 4, max: 1000 };
            default:
                return { min: 0, max: 1000 };
        }
    }

    @computed
    get structuredData(): string {
        return JSON.stringify({
            '@context': 'http://schema.org',
            '@type': 'ItemList',
            itemListElement: this.courses.map((course, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                url: course.link,
            })),
        });
    }

    @action
    setDuration = (duration: Duration): void => {
        this.durationSelection = duration;
    };

    @action
    setCategory = (cid: number): void => {
        this.categorySelection = cid;
    };

    @action
    handleFilterChange = (e: FormEvent<HTMLInputElement>): void => {
        this.filterText = e.currentTarget.value;
    };

    render(): JSX.Element {
        return (
            <div className={styles.catalog}>
                <h1>Course Catalog</h1>
                <div className={styles.search}>
                    <Input
                        raised
                        aria-label="course catalog search"
                        placeholder="Search"
                        type="search"
                        value={this.filterText}
                        onChange={this.handleFilterChange}
                    />
                </div>
                <Sidebar
                    category={this.categorySelection}
                    duration={this.durationSelection}
                    onCategoryChange={this.setCategory}
                    onDurationChange={this.setDuration}
                />
                <section className={styles.courseList} id="content">
                    {this.courses.map(course => (
                        <CourseListing key={course.id} course={course} />
                    ))}
                </section>
                <script
                    dangerouslySetInnerHTML={{ __html: this.structuredData }}
                    type="application/ld+json"
                />
            </div>
        );
    }
}
