import * as React from 'react';
import * as Datepicker from 'react-datepicker';
import paginate from '../../../utils/Pagination';
import { browserDetect } from '../../../utils/BrowserDetect';
import {
    downloadPolyfill,
    getCourseCategory,
    parseCompletionDate,
    calculateIIIHours,
} from '../../../utils/DashboardUtils';
import {
    Header,
    Row,
    Cell,
    Pager,
    FilterRow,
    Flex,
} from '../../../components/TableComponents';

interface Props {
    users: ALiEMU.EducatorDashboard.UserObject;
    courseData: ALiEMU.EducatorDashboard.CourseData;
}

interface State {
    readonly currentPage: number;
    readonly visibleRows: number;
    readonly filteredUsers: ALiEMU.EducatorDashboard.UserMeta[];
    readonly filter: string;
    readonly advancedFilter: boolean;
    readonly dateRange: ALiEMU.EducatorDashboard.DateRange;
}

export class StudentTable extends React.Component<Props, State> {

    private totalStudents: number = Object.keys(this.props.users).length;
    private headerProps = [
        { content: 'Full Name', align: 'left', },
        { content: 'Class', align: 'left', },
        { content: 'Total III Hours', align: 'center', },
        { content: 'User Export', align: 'center', },
    ];

    constructor(props) {
        super(props);

        const filteredUsers = Object.keys(this.props.users)
            .sort((uid1, uid2) => {
                const p1 = this.props.users[uid1].auGraduationYear;
                const p2 = this.props.users[uid2].auGraduationYear;
                if (!p1 && !p2) return 0;
                if (p1 && !p2) return -1;
                if (!p1 && p2) return 1;
                if (p1 < p2) return 1;
                if (p1 > p2) return -1;
                return 0;
            })
            .map(uid => this.props.users[uid]);

        this.state = {
            currentPage: 0,
            visibleRows: 10,
            filteredUsers,
            filter: '',
            advancedFilter: false,
            dateRange: {
                start: null,
                end: null,
            },
        };
    }

    exportCSV(userID: string, e: DOMEvent) {

        e.preventDefault();

        let CSV: string;
        let filename: string;
        const { users } = this.props;

        if (!userID) {
            CSV = [
                'Last Name',
                'First Name',
                'Class of',
                'Total III Hours Awarded',
                'Courses In Progress',
                'Courses Completed',
            ].join(',') + '\n';
            filename = 'ALiEMU_Program_Export.csv';

            Object.keys(users).forEach((uid: string) => {
                let inProgress: number;
                let completed: number;
                try {
                    inProgress = Object.keys(users[uid].courseProgress).length;
                } catch (err) {
                    inProgress = 0;
                }

                try {
                    completed = Object.keys(users[uid].courseCompleted).length;
                } catch (err) {
                    completed = 0;
                }

                CSV +=
                    `"${users[uid].lastName}",` +
                    `"${users[uid].firstName}",` +
                    `"${users[uid].auGraduationYear || ''}",` +
                    `"${calculateIIIHours(users[uid], this.props.courseData.courseMeta, this.state.dateRange)}",` +
                    `"${inProgress - completed}",` +
                    `"${completed}"\n`;
            });
        }
        else {

            const courseProgress = users[userID].courseProgress;
            if (!courseProgress) return alert('This user has not interacted with any courses.');

            filename = `${users[userID].displayName.replace(/\s/, '_')}.csv`;
            CSV = 'Registered Courses,Steps Completed,Date Completed,Associated III Credit Hours,Category\n';

            for (let key of Object.keys(courseProgress)) {
                CSV +=
                    `"${this.props.courseData.courses[key].postTitle}",` +
                    `"${courseProgress[key].completed} out of ${courseProgress[key].total}",` +
                    `"${parseCompletionDate(users[userID].courseCompleted[key])}",` +
                    `"${this.props.courseData.courseMeta[key].recommendedHours}",` +
                    `"${getCourseCategory(key, this.props.courseData.categories)}"\n`;
            }
        }

        const blob = new Blob([CSV], {type: 'text/csv;charset=utf-8'});
        downloadPolyfill(filename, blob, browserDetect(), e.target.id);
    }

    selectDate(type: 'start'|'end', date: moment.Moment) {
        this.setState(
            Object.assign({}, this.state, {
                dateRange: Object.assign({}, this.state.dateRange, {
                    [type]: date,
                }),
            })
        );
    };

    actions(action: {type: string, [key: string]: any}, e: DOMEvent) {
        switch (action.type) {
            case 'PAGINATE': {
                return this.setState(
                    Object.assign({}, this.state, {
                        currentPage: action['page'],
                    })
                );
            }
            case 'SELECT_VISIBLE_ROWS': {
                let selection = e.target.value;
                let visibleRows = selection === 'all' ? this.totalStudents : selection;
                return this.setState(
                    Object.assign({}, this.state, {
                        visibleRows,
                        currentPage: 0,
                    })
                );
            }
            case 'TOGGLE_ADVANCED_FILTER': {
                return this.setState(
                    Object.assign({}, this.state, {
                        advancedFilter: !this.state.advancedFilter,
                    })
                );
            }
        }
    }

    filter(e: DOMEvent) {
        e.preventDefault();

        const filter = e.target.value.toLowerCase();
        const filteredUsers: ALiEMU.EducatorDashboard.UserMeta[] =
            Object.keys(this.props.users)
            .filter(uid => {
                const displayName = this.props.users[uid].displayName.toLowerCase();
                const gradYear = this.props.users[uid].auGraduationYear;
                if (displayName.search(filter) > -1) return true;
                if (gradYear && gradYear.toString().search(filter) > -1) return true;
                return false;
            })
            .sort((uid1, uid2) => {
                const p1 = this.props.users[uid1].auGraduationYear;
                const p2 = this.props.users[uid2].auGraduationYear;
                if (!p1 && !p2) return 0;
                if (p1 && !p2) return -1;
                if (!p1 && p2) return 1;
                if (p1 < p2) return 1;
                if (p1 > p2) return -1;
                return 0;
            })
            .map(uid => this.props.users[uid]);

        this.setState(
            Object.assign({}, this.state, {
                filter,
                filteredUsers,
                currentPage: 0,
            })
        );
    }

    render() {
        return (
            <div className='au-edudash-shadowbox'>
                <h2>Enrolled Students</h2>

                { /* Main filter row */}
                <FilterRow>
                    <div>
                        Show
                        <select
                            style={{ margin: '0 5px', }}
                            id='row-select'
                            defaultValue={this.state.visibleRows}
                            onChange={this.actions.bind(this, {type: 'SELECT_VISIBLE_ROWS'})} >
                            <option value={10}>10</option>
                            { this.totalStudents > 25 &&
                                <option value={25}>25</option>
                            }
                            { this.totalStudents > 50 &&
                                <option value={50}>50</option>
                            }
                            { this.totalStudents > 10 &&
                                <option value={'all'} data-totalStudents={this.totalStudents}>all</option>
                            }
                        </select>
                        students
                    </div>
                    <Flex amount='2'>
                        <label
                            htmlFor='search-query'
                            style={{ padding: '0 10px', }}>
                            <strong>Filter:</strong>
                        </label>
                        <input
                            type='text'
                            id='search-query'
                            value={this.state.filter}
                            onChange={this.filter.bind(this)} />
                        <div
                            style={{
                                fontSize: '1.3em',
                                padding: '1px 7px 2px',
                                border: 'solid rgb(221, 221, 221) 2px',
                                lineHeight: '33px',
                                borderLeft: 0,
                                cursor: 'pointer',
                            }}
                            id='advanced-filter-toggle'
                            onClick={this.actions.bind(this, {type: 'TOGGLE_ADVANCED_FILTER'})} >
                            <i className={
                                this.state.advancedFilter
                                ? 'um-faicon-caret-up'
                                : 'um-faicon-caret-down'
                            } />
                        </div>
                    </Flex>
                    <div>
                        <a
                            className='au-edudash-exportbtn'
                            id='program-export'
                            children='Export Program Data'
                            onClick={this.exportCSV.bind(this, null)} />
                    </div>
                </FilterRow>

                {/* Date query row */}
                { this.state.advancedFilter &&
                    <FilterRow>
                        <Flex amount='1'>
                            <strong
                                children='Display III hours accrued from'
                                style={{padding: '0 10px', }} />
                            <Datepicker
                                ref='datepicker'
                                id='start-date'
                                selected={this.state.dateRange.start}
                                onChange={this.selectDate.bind(this, 'start')} />
                            <strong
                                children='to'
                                style={{padding: '0 10px', }} />
                            <Datepicker
                                id='end-date'
                                selected={this.state.dateRange.end}
                                onChange={this.selectDate.bind(this, 'end')} />
                        </Flex>
                    </FilterRow>
                }

                {/* Table */}
                <Header cells={this.headerProps} />
                {
                    paginate(this.state.filteredUsers, this.state.visibleRows, this.state.currentPage)
                    .map((user, i) =>
                        <Row key={user.ID} id={`student-table-row-${i}`} className='table-row'>
                            <Cell align='left'>{user.displayName}</Cell>
                            <Cell align='left'>{!user.auGraduationYear ? 'Unspecified' : user.auGraduationYear}</Cell>
                            <Cell align='center'>{calculateIIIHours(user, this.props.courseData.courseMeta, this.state.dateRange)}</Cell>
                            <Cell align='center'>
                                <a
                                    className='au-edudash-exportbtn'
                                    children='Export Data'
                                    onClick={this.exportCSV.bind(this, user.ID)}/>
                            </Cell>
                        </Row>
                    )
                }

                {/* Pagination Buttons */}
                <Pager
                    id='pager'
                    totalRows={this.state.filteredUsers.length}
                    currentPage={this.state.currentPage}
                    visibleRows={this.state.visibleRows}
                    onClick={this.actions.bind(this)} />
            </div>
        );
    }
}