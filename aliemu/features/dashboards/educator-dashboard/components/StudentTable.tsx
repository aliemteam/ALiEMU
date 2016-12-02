import * as React from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import * as Datepicker from 'react-datepicker';
import { paginate } from '../../../utils/Pagination';
import * as moment from 'moment';
import { browserDetect } from '../../../utils/BrowserDetect';
import {
    downloadPolyfill,
    calculateIIIHours,
    CSV,
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

@observer
export class StudentTable extends React.Component<Props, {}> {

    readonly CSV: CSV;
    readonly headerCells: { content: string, align: 'left'|'right'|'center'}[] = [
        { align: 'left', content: 'Full Name' },
        { align: 'left', content: 'Class' },
        { align: 'left', content: 'Last Activity' },
        { align: 'center', content: 'Total III Hours' },
        { align: 'center', content: 'User Export' },
    ];
    readonly totalStudents: number;
    readonly users: string[] = [];

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

    constructor(props) {
        super(props);
        this.CSV = new CSV(this.props.users, this.props.courseData);
        this.totalStudents = Object.keys(this.props.users).length;
        this.users = Object.keys(this.props.users)
        .sort((uid1, uid2) => {
            const p1 = this.props.users[uid1].auGraduationYear;
            const p2 = this.props.users[uid2].auGraduationYear;
            if (!p1 && !p2) return 0;
            if (p1 && !p2) return -1;
            if (!p1 && p2) return 1;
            if (p1 < p2) return 1;
            if (p1 > p2) return -1;
            return 0;
        });
    }

    @computed
    get dateRange() {
        return {
            start: this.startDate,
            end: this.endDate,
        };
    }

    @computed
    get filteredUsers(): ALiEMU.EducatorDashboard.UserMeta[] {
        return this.users
            .filter(uid => {
                const displayName = this.props.users[uid].displayName.toLowerCase();
                const gradYear = this.props.users[uid].auGraduationYear;
                if (displayName.search(this.filter.toLowerCase()) > -1) return true;
                if (gradYear && gradYear.toString().search(this.filter) > -1) return true;
                return false;
            })
            .map(uid => this.props.users[uid]);
    }

    @computed
    get visibleRows(): number {
        if (this.rowSelection === 'all') return this.totalStudents;
        return parseInt(this.rowSelection, 10);
    }

    @action
    paginate = (e: React.MouseEvent<HTMLElement>): void => {
        this.page = parseInt((e.target as HTMLElement).dataset['page'], 10);
    }

    @action
    setFilterText = (e: React.FormEvent<HTMLInputElement>): void => {
        this.filter = (e.target as HTMLInputElement).value;
    }

    @action
    setEndDate = (d): void => {
        this.endDate = d;
    }

    @action
    setRowSelection = (e: React.FormEvent<HTMLSelectElement>): void => {
        this.rowSelection = (e.target as HTMLSelectElement).value;
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

    exportCSV = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        const userID = target.dataset['userId'];
        const CSV = userID !== undefined
            ? this.CSV.user(userID)
            : this.CSV.allUsers(this.dateRange);

        if (typeof CSV === 'boolean') {
            alert('This user has not interacted with any courses');
            return;
        }

        const blob = new Blob([CSV.data], { type: 'text/csv;charset=utf-8' });
        downloadPolyfill(CSV.filename, blob, browserDetect(), target.id);
    }

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
                            { this.totalStudents > 25 &&
                                <option
                                    value="25"
                                    children="25"
                                    aria-selected={this.rowSelection === '25'}
                                />
                            }
                            { this.totalStudents > 50 &&
                                <option
                                    value="50"
                                    children="50"
                                    aria-selected={this.rowSelection === '50'}
                                />
                            }
                            { this.totalStudents > 10 &&
                                <option
                                    value="all"
                                    children="all"
                                    aria-selected={this.rowSelection === 'all'}
                                />
                            }
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
                            className="au-edudash-exportbtn"
                            role="button"
                            id="program-export"
                            children="Export Program Data"
                            onClick={this.exportCSV}
                        />
                    </div>
                </FilterRow>

                {/* Date query row */}
                { this.advancedFilterVisible &&
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
                }

                {/* Table */}
                <Header cells={this.headerCells} />
                {
                    paginate(this.filteredUsers, this.visibleRows, this.page)
                    .map((user: ALiEMU.EducatorDashboard.UserMeta, i) => (
                        <Row key={user.ID} id={`student-table-row-${i}`} className="table-row">
                            <Cell
                                align="left"
                                children={user.displayName}
                            />
                            <Cell
                                align="left"
                                children={!user.auGraduationYear ? 'Unspecified' : user.auGraduationYear}
                            />
                            <Cell
                                align="left"
                                children={
                                    !user.umLastLogin || user.umLastLogin.toString().length !== 10
                                    ? 'No activity found'
                                    : moment.unix(user.umLastLogin).fromNow()
                                }
                            />
                            <Cell
                                align="center"
                                children={
                                    calculateIIIHours(user, this.props.courseData.courseMeta, this.dateRange)
                                }
                            />
                            <Cell align="center">
                                <a
                                    className="au-edudash-exportbtn"
                                    children="Export Data"
                                    data-user-id={user.ID}
                                    role="button"
                                    onClick={this.exportCSV}
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
