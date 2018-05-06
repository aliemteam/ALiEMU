import { action, computed, flow, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import CourseListing from 'components/course-listing/';
import { Input } from 'components/forms/';
import Sidebar, { Duration } from './sidebar';

import * as styles from './catalog.scss';

export interface CatalogGlobals {
    categories: {
        [categoryId: string]: string;
    };
    courses: LearnDash.Course[];
    headers: {
        [k in keyof Omit<CatalogGlobals, 'headers'>]: WordPress.Headers
    };
}

interface DurationObj {
    min: number;
    max: number;
}

declare const AU_Catalog: CatalogGlobals;

@observer
export default class Catalog extends React.Component {
    @observable filterText = '';
    @observable categorySelection: number = 0;
    @observable durationSelection: Duration = Duration.NONE;

    fetchCourses = flow(function*(this: Catalog): any {
        const pages = AU_Catalog.headers.courses['X-WP-TotalPages'];
        let page = 2;
        let courses: LearnDash.Course[] = [];
        try {
            while (page <= pages) {
                const response = yield fetch(
                    `${location.origin}/wp-json/ldlms/v1/courses?page=${page}&_embed`,
                );
                const json: LearnDash.Course[] = yield response.json();
                courses = [...courses, ...json];
                page++;
            }
        } catch (e) {
            // tslint:disable-next-line
            console.error(e);
        }
        this._courses.push(...courses);
    });

    private _courses = observable([...AU_Catalog.courses], { deep: false });

    componentDidMount(): void {
        this.fetchCourses();
    }

    @computed
    get courses(): LearnDash.Course[] {
        return this._courses.filter(course => {
            if (
                this.categorySelection !== 0 &&
                !course.categories.includes(this.categorySelection)
            ) {
                return false;
            }

            if (
                this.filterText.length &&
                `${course.title} ${course.course_short_description}`
                    .toLowerCase()
                    .indexOf(this.filterText.toLowerCase()) === -1
            ) {
                return false;
            }

            if (this.durationSelection !== Duration.NONE) {
                const duration = parseFloat(course.recommendedHours);
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
    handleFilterChange = (e: React.FormEvent<HTMLInputElement>): void => {
        this.filterText = e.currentTarget.value;
    };

    render(): JSX.Element {
        return (
            <div className={styles.catalog}>
                <h1>Course Catalog</h1>
                <div className={styles.search}>
                    <Input
                        type="search"
                        placeholder="Search"
                        aria-label="course catalog search"
                        value={this.filterText}
                        onChange={this.handleFilterChange}
                    />
                </div>
                <Sidebar
                    category={this.categorySelection}
                    duration={this.durationSelection}
                    onDurationChange={this.setDuration}
                    onCategoryChange={this.setCategory}
                />
                <section id="content" className={styles.courseList}>
                    {this.courses.map(course => (
                        <CourseListing key={course.id} course={course} />
                    ))}
                </section>
                {/* tslint:disable-next-line:react-no-dangerous-html */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: this.structuredData }}
                />
            </div>
        );
    }
}
