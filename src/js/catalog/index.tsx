import { useEffect, useMemo, useState } from '@wordpress/element';

import CourseListing from 'components/course-listing';
import Input from 'components/forms/input';
import { Courses } from 'utils/api';

import Sidebar from './sidebar';
import styles from './catalog.scss';

declare const AU_Catalog: {
    categories: Record<number, string>;
    courses: Courses.Course[];
};

export const enum Duration {
    NONE,
    LESS_THAN_TWO,
    TWO_TO_FOUR,
    FOUR_OR_MORE,
}

export default function Catalog() {
    const [courses, setCourses] = useState([...AU_Catalog.courses]);
    const [categoryFilter, setCategoryFilter] = useState(0);
    const [durationFilter, setDurationFilter] = useState(Duration.NONE);
    const [textFilter, setTextFilter] = useState('');

    useEffect(() => {
        Courses.fetchMany(
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
                ].join(','),
                per_page: 100,
            },
            [...courses],
        ).then(data => setCourses([...data]));
    }, []);

    const visibleCourses = useMemo(
        () =>
            courses.filter(course => {
                if (
                    categoryFilter > 0 &&
                    !course.categories.includes(categoryFilter)
                ) {
                    return false;
                }

                if (
                    textFilter &&
                    `${course.title.rendered} ${course.description}`
                        .toLowerCase()
                        .indexOf(textFilter.toLowerCase()) === -1
                ) {
                    return false;
                }

                switch (durationFilter) {
                    case Duration.LESS_THAN_TWO:
                        return course.hours < 2;
                    case Duration.TWO_TO_FOUR:
                        return 2 <= course.hours && course.hours < 4;
                    case Duration.FOUR_OR_MORE:
                        return course.hours >= 4;
                    default:
                        return true;
                }
            }),

        [courses, categoryFilter, durationFilter, textFilter],
    );

    const structuredData = useMemo(
        () =>
            JSON.stringify({
                '@context': 'http://schema.org',
                '@type': 'ItemList',
                itemListElement: visibleCourses.map(({ link }, i) => ({
                    '@type': 'ListItem',
                    position: i + 1,
                    url: link,
                })),
            }),
        [visibleCourses],
    );

    return (
        <div className={styles.catalog}>
            <h1>Course Catalog</h1>
            <div className={styles.search}>
                <Input
                    isRaised
                    aria-controls="content"
                    aria-label="course catalog search"
                    placeholder="Search"
                    type="search"
                    value={textFilter}
                    onChange={e => setTextFilter(e.currentTarget.value)}
                />
            </div>
            <Sidebar
                categories={AU_Catalog.categories}
                selectedCategory={categoryFilter}
                selectedDuration={durationFilter}
                onCategoryChange={id =>
                    setCategoryFilter(categoryFilter === id ? 0 : id)
                }
                onDurationChange={duration =>
                    setDurationFilter(
                        durationFilter === duration ? Duration.NONE : duration,
                    )
                }
            />
            <section
                aria-live="assertive"
                className={styles.courseList}
                id="content"
                role="list"
            >
                {visibleCourses.map(course => (
                    <CourseListing key={course.id} course={course} />
                ))}
            </section>
            <script
                dangerouslySetInnerHTML={{ __html: structuredData }}
                type="application/ld+json"
            />
        </div>
    );
}
