import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import WPGraphQL, { User as U } from 'wp-graphql';
import {
    Cell,
    FilterRow,
    Flex,
    Header,
    Pager,
    Row,
} from '../../components/TableComponents';
import { paginate } from '../../utils/Pagination';

declare const _AU_API;

const transport = new WPGraphQL(_AU_API.root, {
    nonce: _AU_API.nonce,
    postTypes: [
        { name: 'course', namePlural: 'courses', restBase: 'sfwd-courses' },
        { name: 'lesson', namePlural: 'lessons', restBase: 'sfwd-lessons' },
    ],
});

interface UserMeta {
    completedCourses: {
        [id: number]: {
            date: number;
            hours: number;
        };
    };
    graduationYear: number|null;
    group: {
        id: string;
        members: number[];
    };
    lastActivity: number;
}

type User = U<UserMeta>;

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Course {
    id: number;
    title: string;
    categories: number[];
}

interface Response {
    users: Pick<User, 'id'|'name'|'meta'|'username'>[];
    categories: Category[];
    courses: Course[];
}

interface Props {
    users: number[];
}

@observer
export class CourseTable extends React.PureComponent<Props, {}> {
    readonly visibleRows = 10;
    readonly headerCells: { content: string, align: 'left'|'right'|'center'}[] = [
        { align: 'left', content: 'User Name' },
        { align: 'left', content: 'Course Completion Date' },
    ];

    categories = observable.shallowArray<Category>([]);
    courses = observable.shallowArray<Course>([]);
    users = observable.shallowArray<Pick<User, 'id'|'name'|'meta'|'username'>>([]);

    @observable
    page = 0;

    @observable
    categorySelection: number = -1;

    @observable
    courseSelection: number = -1;

    async componentDidMount() {
        const data: Response = await transport.send(`
            query Users($users: [Int], $n: Int) {
                categories(exclude: 1) {
                    id
                    name
                    slug
                }
                courses(per_page: 100) {
                    id
                    title
                    categories
                }
                users(include: $users, per_page: $n) {
                    id
                    name
                    meta
                    username
                }
            }
        `, { users: this.props.users.slice(), n: this.props.users.length });
        data.courses = data.courses
            .filter(c => c.categories.length > 0)
            .map(c => ({ ...c, title: c.title.replace('&#8211;', '–') }));
        this.init(data);
    }

    @action
    init({ categories, courses, users }: Response) {
        this.categories.replace(categories);
        this.courses.replace(courses);
        this.users.replace(users);
    }

    @computed
    get relevantUsers() {
        return this.courseSelection === -1
            ? []
            : this.users.filter(user => (
                Object.keys(user.meta.completedCourses).indexOf(`${this.courseSelection}`) > -1
            ));
    }

    @computed
    get filteredCourses() {
        return this.courses.filter(c => c.categories.indexOf(this.categorySelection) > -1);
    }

    @action
    selectCategory = (e: React.FormEvent<HTMLSelectElement>): void => {
        this.categorySelection = parseInt(e.currentTarget.value, 10);
        this.courseSelection = -1;
    }

    @action
    selectCourse = (e: React.FormEvent<HTMLSelectElement>): void => {
        this.courseSelection = parseInt(e.currentTarget.value, 10);
    }

    @action
    paginate = (e: React.MouseEvent<HTMLElement>): void => {
        this.page = parseInt(e.currentTarget.dataset['page'], 10);
    }

    // FIXME:
    // tslint:disable-next-line:no-console
    todo = () => console.log('todo....');

    render() {
        return (
            <div className="au-edudash-shadowbox">
                <h2 children="Course Overview" />
                <FilterRow>
                    <Flex amount={1}>
                        <select
                            id="category"
                            style={{width: '95%'}}
                            onChange={this.selectCategory}
                            value={this.categorySelection}
                        >
                            <option
                                value=""
                                aria-selected={this.categorySelection === -1}
                                children="-- Select a Category --"
                            />
                            { this.categories.map(category => (
                                    <option
                                        value={category.id}
                                        key={category.slug}
                                        aria-selected={this.categorySelection === category.id}
                                        children={category.name}
                                    />
                                ))
                            }
                        </select>
                    </Flex>
                    <Flex amount={2}>
                        <select
                            id="course"
                            style={{width: '95%'}}
                            value={this.courseSelection}
                            onChange={this.selectCourse}
                            disabled={this.categorySelection === -1}
                        >
                            <option
                                value={-1}
                                children="-- Select a Course --"
                                aria-selected={this.courseSelection === -1}
                            />
                            { this.categorySelection !== -1 &&
                                this.filteredCourses.map(course => (
                                    <option
                                        value={course.id}
                                        key={course.id}
                                        children={course.title}
                                        aria-selected={this.courseSelection === course.id}
                                    />
                                ))
                            }
                        </select>
                    </Flex>
                    <Flex amount={1}>
                        <a
                            id="course-export"
                            className={
                                this.courseSelection !== -1
                                ? 'btn btn--primary'
                                : 'btn btn--primary btn--disabled'
                            }
                            children="Export Course Data"
                            role="button"
                            onClick={this.todo}
                        />
                    </Flex>
                </FilterRow>
                <Header cells={this.headerCells} />
                { paginate(this.relevantUsers, this.visibleRows, this.page)
                    .map((user, i) => (
                        <Row key={user.id} id={`course-table-row-${i}`}>
                            <Cell
                                align="left"
                                children={user.name !== '' ? user.name : user.username}
                            />
                            <Cell
                                align="left"
                                children={moment(user.meta.completedCourses[this.courseSelection].date).calendar()}
                            />
                        </Row>
                    ))
                }
                { this.courseSelection !== -1 && (
                    <Pager
                        visibleRows={this.visibleRows}
                        currentPage={this.page}
                        totalRows={this.relevantUsers.length}
                        onClick={this.paginate}
                    />
                )}
            </div>
        );
    }
}
