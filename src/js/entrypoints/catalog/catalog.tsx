import { useEffect, useMemo, useState } from '@wordpress/element';

import CourseListing from 'components/course-listing';
import Input from 'components/forms/input';
import useQueryParam from 'hooks/use-query-param';
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
    const [courses, setCourses] = useState([
        ...AU_Catalog.courses.filter(c => !c.content.protected),
    ]);
    const [categoryFilter, setCategoryFilter] = useQueryParam<string>('c', '0');
    const [durationFilter, setDurationFilter] = useQueryParam<string>('d', '0');
    const [textFilter, setTextFilter] = useQueryParam<string>('q', '');

    useEffect(() => {
        Courses.fetchMany(
            {
                _fields: [
                    '_links',
                    'categories',
                    'content',
                    'description',
                    'date_gmt',
                    'featured_media',
                    'id',
                    'link',
                    'hours',
                    'title',
                ].join(','),
                orderby: 'date',
                order: 'desc',
                per_page: 100,
            },
            [...AU_Catalog.courses],
        ).then(data => setCourses([...data.filter(c => !c.content.protected)]));
    }, []);

    const category = parseInt(categoryFilter, 10) || 0;
    const duration = parseInt(durationFilter, 10) || 0;

    const visibleCourses = useMemo(
        () =>
            courses.filter(course => {
                if (category > 0 && !course.categories.includes(category)) {
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

                switch (duration) {
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

        [courses, category, duration, textFilter],
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
                    onChange={e =>
                        e.currentTarget.value === ''
                            ? setTextFilter()
                            : setTextFilter(e.currentTarget.value)
                    }
                />
            </div>
            <Sidebar
                categories={AU_Catalog.categories}
                selectedCategory={category}
                selectedDuration={duration}
                onCategoryChange={id =>
                    category === id
                        ? setCategoryFilter()
                        : setCategoryFilter(id.toString())
                }
                onDurationChange={newDuration =>
                    newDuration === duration
                        ? setDurationFilter()
                        : setDurationFilter(newDuration.toString())
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
