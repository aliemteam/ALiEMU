import * as React from 'react';
import * as Datepicker from 'react-datepicker';
import * as Moment from 'moment';
import paginate from '../../../utils/Pagination';
import { browserDetect, } from '../../../utils/BrowserDetect';
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
    Button,
} from '../../../components/TableComponents';

require('react-datepicker/dist/react-datepicker.css');

interface Props {
    users: ALiEMU.EducatorDashboard.UserObject;
    courseData: ALiEMU.EducatorDashboard.CourseData;
}

interface State {
    currentPage: number;
    visibleRows: number;
    filteredUsers: ALiEMU.EducatorDashboard.UserObject;
    filter: string;
    advancedFilter: boolean;
    startDate: moment.Moment;
    endDate: moment.Moment;
}

export class StudentTable extends React.Component<Props, State> {

    private totalStudents: number = Object.keys(this.props.users).length;
    private headerProps = [
        { content: 'Full Name', centered: false, },
        { content: 'Class', centered: false, },
        { content: 'Total III Hours', centered: true, },
        { content: 'User Export', centered: true, },
    ];

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
            visibleRows: 10,
            filteredUsers: this.props.users,
            filter: '',
            advancedFilter: false,
            startDate: null,
            endDate: null,
        };
    }

    exportAllData(e: DOMEvent) {

        const { users, } = this.props;
        let CSV: string =
            'Last Name,First Name,Class of,Total III Hours Awarded,Courses In Progress,Courses Completed\n';

        Object.keys(users).forEach((uid: string) => {
            let inProgress: number;
            let completed: number;
            try {
                inProgress = Object.keys(users[uid].courseProgress).length;
            } catch (e) {
                inProgress = 0;
            }

            try {
                completed = Object.keys(users[uid].courseCompleted).length;
            } catch (e) {
                completed = 0;
            }

            CSV +=
                `"${users[uid].lastName}",` +
                `"${users[uid].firstName}",` +
                `"${users[uid].auGraduationYear || ''}",` +
                `"${calculateIIIHours(users[uid], this.props.courseData.courseMeta)}",` +
                `"${inProgress - completed}",` +
                `"${completed}"\n`;
        });

        const blob = new Blob(
            [CSV, ], { type: 'text/csv;charset=utf-8', }
        );

        downloadPolyfill('ALiEMU_Program_Export.csv', blob, browserDetect(), e.target.id);
    }

    exportUserData(userID: string, e: DOMEvent) {

        if (!this.props.users[userID].courseProgress) {
            alert('This user has not interacted with any courses.');
            return;
        }

        const courseProgress = this.props.users[userID].courseProgress;
        const filename = `${this.props.users[userID].displayName.replace(/\s/, '_')}.csv`;
        let CSV: string = 'Registered Courses,Steps Completed,Date Completed,Associated III Credit Hours,Category\n';

        for (let key of Object.keys(courseProgress)) {
            CSV +=
                `"${this.props.courseData.courses[key].postTitle}",` +
                `"${courseProgress[key].completed} out of ${courseProgress[key].total}",` +
                `"${parseCompletionDate(this.props.users[userID].courseCompleted[key])}",` +
                `"${this.props.courseData.courseMeta[key].recommendedHours}",` +
                `"${getCourseCategory(key, this.props.courseData.categories)}"\n`;
        }

        const blob = new Blob(
            [CSV, ], { type: 'text/csv;charset=utf-8', }
        );

        downloadPolyfill(filename, blob, browserDetect(), e.target.id);
    }

    handleDateChange(type: string, date: moment.Moment) {
        this.setState(
            Object.assign({}, this.state, {
                [type]: date,
            })
        );
    }

    paginate(e: React.UIEvent) {
        let currentPage = parseInt((e.target as HTMLSpanElement).innerText) - 1;
        this.setState(Object.assign({}, this.state, { currentPage, }));
    }

    rowSelect(e: React.UIEvent) {
        let selection = (e.target as HTMLSelectElement).value;
        let visibleRows = selection === 'all' ? this.totalStudents : selection;
        this.setState(Object.assign({}, this.state, { visibleRows, }));
    }

    toggleAdvancedFilter(e: React.UIEvent) {
        this.setState(
            Object.assign({}, this.state, { advancedFilter: !this.state.advancedFilter, })
        );
    }

    filterString(e: DOMEvent) {
        e.preventDefault();

        const filter = e.target.value.toLowerCase();
        const filteredUsers: ALiEMU.EducatorDashboard.UserObject =
            Object.keys(this.props.users).filter(uid => {
                const displayName = this.props.users[uid].displayName.toLowerCase();
                const gradYear = this.props.users[uid].auGraduationYear;
                if (displayName.search(filter) > -1) return true;
                if (gradYear && gradYear.toString().search(filter) > -1) return true;
                return false;
            }).reduce((res, uid) => {
                res[uid] = this.props.users[uid];
                return res;
            }, {});

        this.setState(
            Object.assign({}, this.state, {
                filter,
                filteredUsers,
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
                            defaultValue={this.state.visibleRows}
                            onChange={this.rowSelect.bind(this)} >
                            <option value={10}>10</option>
                            { this.totalStudents > 25 &&
                                <option value={25}>25</option>
                            }
                            { this.totalStudents > 50 &&
                                <option value={50}>50</option>
                            }
                            <option value={'all'} data-totalStudents={this.totalStudents}>all</option>
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
                            onChange={this.filterString.bind(this)} />
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
                            onClick={this.toggleAdvancedFilter.bind(this)} >
                            <i className={
                                this.state.advancedFilter
                                ? 'um-faicon-caret-up'
                                : 'um-faicon-caret-down'
                            } />
                        </div>
                    </Flex>
                    <div>
                        <Button
                            children='Export Program Data'
                            onClick={this.exportAllData.bind(this)} />
                    </div>
                </FilterRow>

                {/* Date query row */}
                { this.state.advancedFilter &&
                    <FilterRow>
                        <Flex amount='1'>
                            <strong
                                children='From'
                                style={{padding: '0 10px', }} />
                            <Datepicker
                                selected={this.state.startDate}
                                onChange={this.handleDateChange.bind(this, 'startDate')} />
                            <strong
                                children='to'
                                style={{padding: '0 10px', }} />
                            <Datepicker
                                selected={this.state.endDate}
                                onChange={this.handleDateChange.bind(this, 'endDate')} />
                            <Button children='Recalculate' />
                        </Flex>
                    </FilterRow>
                }

                {/* Table */}
                <Header cells={this.headerProps} />
                {
                    paginate(this.state.filteredUsers, this.state.visibleRows, this.state.currentPage)
                    .map((uid, i) =>
                    <TableBody
                        key={uid}
                        id={uid}
                        name={this.props.users[uid].displayName}
                        classOf={this.props.users[uid].auGraduationYear}
                        hours={calculateIIIHours(this.props.users[uid], this.props.courseData.courseMeta)}
                        onClick={this.exportUserData.bind(this, uid)} />
                    )
                }

                {/* Pagination Buttons */}
                <Pager
                    totalRows={Object.keys(this.state.filteredUsers).length}
                    currentPage={this.state.currentPage}
                    visibleRows={this.state.visibleRows}
                    onClick={this.paginate.bind(this)} />
            </div>
        );
    }
}



interface TableBodyProps {
    id: string;
    name: string;
    classOf: string;
    hours: number;
    onClick();
}

class TableBody extends React.Component<TableBodyProps, {}> {

    constructor(props) {
        super(props);
    }

    render() {
        const { name, classOf, hours, onClick, id, } = this.props;
        return (
            <Row>
                <Cell align='left'>{name}</Cell>
                <Cell align='left'>{classOf}</Cell>
                <Cell align='center'>{hours}</Cell>
                <Cell align='center'>
                    <Button
                        children='Export Data'
                        id={id}
                        onClick={onClick}/>
                </Cell>
            </Row>
        );
    }
}
