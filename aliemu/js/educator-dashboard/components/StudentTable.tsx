import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';
import * as Datepicker from 'react-datepicker';
import WPGraphQL, { User as IUser } from 'wp-graphql';
import { Cell, FilterRow, Flex, Header, Pager, Row } from '../../components/TableComponents';
import { paginate } from '../../utils/Pagination';

const transport = new WPGraphQL(_AU_API.root, {
    nonce: _AU_API.nonce,
    postTypes: [
        { name: 'course', namePlural: 'courses', restBase: 'sfwd-courses' },
        { name: 'lesson', namePlural: 'lessons', restBase: 'sfwd-lessons' },
    ],
});

type User = Pick<IUser<UserMeta>, 'id'|'name'|'meta'>;

interface Response {
    users: User[];
}

interface Props {
    users: number[];
}

@observer
export class StudentTable extends React.Component<Props, {}> {

    readonly headerCells: { content: string, align: 'left'|'right'|'center'}[] = [
        { align: 'left', content: 'Full Name' },
        { align: 'left', content: 'Class' },
        { align: 'left', content: 'Last Activity' },
        { align: 'center', content: 'Total III Hours' },
        { align: 'center', content: 'User Export' },
    ];

    users = observable.array<User>([]);

    @observable
    advancedFilterVisible = false;

    @observable
    filter = '';

    @observable
    page = 0;

    @observable
    startDate: moment.Moment = null;

    @observable
    endDate: moment.Moment = null;

    @observable
    rowSelection = '10';

    async componentDidMount() {
        const data: Response = await transport.send<Response>(`
            query getUsers($users: [Int], $n: Int) {
                users(include: $users, per_page: $n) {
                    id
                    name
                    meta
                }
            }
        `, { users: this.props.users, n: this.props.users.length });
        data.users.sort((a, b) => {
            const u1 = a.meta.graduationYear || 0;
            const u2 = b.meta.graduationYear || 0;
            if (u1 < u2) { return 1; }
            if (u2 > u1) { return -1; }
            return 0;
        });
        this.init(data.users);
    }

    @action init(users: User[]) {
        this.users.replace(users);
    }

    @computed
    get dateRange() {
        return {
            start: this.startDate,
            end: this.endDate,
        };
    }

    @computed
    get filteredUsers(): User[] {
        return this.users
            .filter(user => {
                const matchInName = user.name.search(new RegExp(this.filter, 'i')) > -1;
                const matchInYear = `${user.meta.graduationYear}`.search(this.filter) > -1;
                if (matchInName || matchInYear) { return true; }
                return false;
            })
            .map(user => ({
                ...user,
                meta: {
                    ...user.meta,
                    completedCourses: Object.keys(user.meta.completedCourses).reduce((prev, curr) => {
                        const course = user.meta.completedCourses[curr];
                        const tooEarly = this.startDate && course.date < this.startDate.valueOf();
                        const tooLate = this.endDate && course.date > this.endDate.valueOf();
                        if (tooEarly || tooLate) { return prev; }
                        return { ...prev, [curr]: course };
                    }, {}),
                },
            }));
    }

    @computed
    get visibleRows(): number {
        if (this.rowSelection === 'all') return this.users.length;
        return parseInt(this.rowSelection, 10);
    }

    @action
    paginate = (e: React.MouseEvent<HTMLElement>): void => {
        this.page = parseInt(e.currentTarget.dataset.page, 10);
    }

    @action
    setFilterText = (e: React.FormEvent<HTMLInputElement>): void => {
        this.filter = e.currentTarget.value;
    }

    @action
    setEndDate = (d): void => {
        this.endDate = d;
    }

    @action
    setRowSelection = (e: React.FormEvent<HTMLSelectElement>): void => {
        this.rowSelection = e.currentTarget.value;
        this.page = 0;
    }

    @action
    setStartDate = (d): void => {
        this.startDate = d;
    }

    @action
    toggleAdvancedFilter = (): void => {
        this.advancedFilterVisible = !this.advancedFilterVisible;
    }

    parseHours = (user: User): number => {
        return Object.keys(user.meta.completedCourses).reduce((total, k) => (
            total + user.meta.completedCourses[k].hours
        ), 0);
    }

    // FIXME:
    // tslint:disable-next-line:no-console
    todo = () => console.log('TODO!');

    render() {
        return (
            <div className="au-edudash-shadowbox">
                <h2>Enrolled Students</h2>

                {/* Main filter row */}
                <FilterRow>
                    <div>
                        Show
                        <select
                            style={{ margin: '0 5px' }}
                            id="row-select"
                            value={this.rowSelection}
                            onChange={this.setRowSelection}
                        >
                            <option
                                value="10"
                                children="10"
                                aria-selected={this.rowSelection === '10'}
                            />
                            { this.users.length > 25 && (
                                <option
                                    value="25"
                                    children="25"
                                    aria-selected={this.rowSelection === '25'}
                                />
                            )}
                            { this.users.length > 50 && (
                                <option
                                    value="50"
                                    children="50"
                                    aria-selected={this.rowSelection === '50'}
                                />
                            )}
                            { this.users.length > 10 && (
                                <option
                                    value="all"
                                    children="all"
                                    aria-selected={this.rowSelection === 'all'}
                                />
                            )}
                        </select>
                        students
                    </div>
                    <Flex amount={2}>
                        <label
                            htmlFor="search-query"
                            style={{ padding: '0 10px' }}
                        >
                            <strong>Filter:</strong>
                        </label>
                        <input
                            type="text"
                            id="search-query"
                            value={this.filter}
                            onChange={this.setFilterText as any}
                        />
                        <div
                            style={{
                                border: 'solid rgb(221, 221, 221) 2px',
                                borderLeft: 0,
                                cursor: 'pointer',
                                fontSize: '1.3em',
                                lineHeight: '33px',
                                padding: '1px 7px 2px',
                                margin: '0 20px 0 0',
                            }}
                            role="button"
                            id="advanced-filter-toggle"
                            onClick={this.toggleAdvancedFilter}
                        >
                            <i
                                className={
                                    this.advancedFilterVisible
                                    ? 'um-faicon-caret-up'
                                    : 'um-faicon-caret-down'
                                }
                            />
                        </div>
                    </Flex>
                    <div>
                        <a
                            className="btn btn--primary"
                            role="button"
                            id="program-export"
                            children="Export Program Data"
                            onClick={this.todo}
                        />
                    </div>
                </FilterRow>

                {/* Date query row */}
                { this.advancedFilterVisible && (
                    <FilterRow>
                        <Flex amount={1}>
                            <strong
                                children="Display III hours accrued from"
                                style={{padding: '0 10px' }}
                            />
                            <Datepicker
                                id="start-date"
                                selected={this.startDate}
                                onChange={this.setStartDate as any}
                            />
                            <strong
                                children="to"
                                style={{padding: '0 10px' }}
                            />
                            <Datepicker
                                id="end-date"
                                selected={this.endDate}
                                onChange={this.setEndDate as any}
                            />
                        </Flex>
                    </FilterRow>
                )}

                {/* Table */}
                <Header cells={this.headerCells} />
                {
                    paginate(this.filteredUsers, this.visibleRows, this.page)
                    .map((user: User, i) => (
                        <Row key={user.id} id={`student-table-row-${i}`} className="table-row">
                            <Cell
                                align="left"
                                children={user.name}
                            />
                            <Cell
                                align="left"
                                children={! user.meta.graduationYear ? 'Unspecified' : user.meta.graduationYear}
                            />
                            <Cell
                                align="left"
                                children={
                                    !user.meta.lastActivity
                                    ? 'No activity found'
                                    : moment(user.meta.lastActivity).fromNow()
                                }
                            />
                            <Cell
                                align="center"
                                children={this.parseHours(user)}
                            />
                            <Cell align="center">
                                <a
                                    className="btn btn--flat"
                                    children="Export Data"
                                    data-user-id={user.id}
                                    role="button"
                                    onClick={this.todo}
                                />
                            </Cell>
                        </Row>
                    ))
                }

                {/* Pagination Buttons */}
                <Pager
                    totalRows={this.filteredUsers.length}
                    currentPage={this.page}
                    visibleRows={this.visibleRows}
                    onClick={this.paginate}
                />
            </div>
        );
    }
}
