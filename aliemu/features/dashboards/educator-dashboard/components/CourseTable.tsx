import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { unix } from 'moment';

import * as React from 'react';

import {
    Cell,
    FilterRow,
    Flex,
    Header,
    Pager,
    Row,
} from '../../../components/TableComponents';
import { browserDetect } from '../../../utils/BrowserDetect';
import {
    CSV,
    downloadPolyfill,
} from '../../../utils/DashboardUtils';
import { paginate } from '../../../utils/Pagination';

interface Props {
    courseData: ALiEMU.EducatorDashboard.CourseData;
    users: ALiEMU.EducatorDashboard.UserObject;
}

@observer
export class CourseTable extends React.PureComponent<Props, {}> {

    readonly categories: string[];
    readonly CSV: CSV;
    readonly visibleRows = 10;
    headerCells: { content: string, align: 'left'|'right'|'center'}[] = [
        { align: 'left', content: 'User Name' },
        { align: 'left', content: 'Course Completion Date' },
    ];

    @observable
    page = 0;

    @observable
    categorySelection = '';

    @observable
    courseSelection = '';

    constructor(props) {
        super(props);
        this.CSV = new CSV(this.props.users, this.props.courseData);
        this.categories = Object.keys(this.props.courseData.categories)
            .filter((category) => category !== '');
    }

    @computed
    get relevantUsers(): ALiEMU.EducatorDashboard.UserMeta[] {
        if (this.courseSelection === '') return [];
        return Object.keys(this.props.users)
            .filter(id => (
                this.props.users[id].courseCompleted &&
                this.props.users[id].courseCompleted[this.courseSelection]
            ))
            .map(id => this.props.users[id]);
    }

    @action
    selectCategory = (e: React.FormEvent<HTMLSelectElement>): void => {
        this.categorySelection = (e.target as HTMLSelectElement).value;
        this.courseSelection = '';
    }

    @action
    selectCourse = (e: React.FormEvent<HTMLSelectElement>): void => {
        this.courseSelection = (e.target as HTMLSelectElement).value;
    }

    @action
    paginate = (e: React.MouseEvent<HTMLElement>): void => {
        this.page = parseInt((e.target as HTMLElement).dataset['page'], 10);
    }

    exportCourseData = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        const courseID = this.courseSelection;
        const CSV = this.CSV.course(courseID);
        const blob = new Blob([CSV.data], { type: 'text/csv;charset=utf-8' });
        downloadPolyfill(CSV.filename, blob, browserDetect(), (e.target as HTMLAnchorElement).id);
    }

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
                                aria-selected={this.categorySelection === ''}
                                children="-- Select a Category --"
                            />
                            { this.categories.map((category: string, i: number) => (
                                    <option
                                        value={category}
                                        key={i}
                                        aria-selected={this.categorySelection === category}
                                        children={category}
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
                            disabled={this.categorySelection === ''}
                        >
                            <option
                                value=""
                                children="-- Select a Course --"
                                aria-selected={this.courseSelection === ''}
                            />
                            { this.categorySelection !== '' &&
                                Object.keys(this.props.courseData.categories[this.categorySelection]).map((courseID) => ( // tslint:disable-line
                                    <option
                                        value={courseID}
                                        key={courseID}
                                        children={this.props.courseData.courses[courseID].postTitle}
                                        aria-selected={this.courseSelection === courseID}
                                    />
                                ))
                            }
                        </select>
                    </Flex>
                    <Flex amount={1}>
                        <a
                            id="course-export"
                            className={
                                this.courseSelection !== ''
                                ? 'btn btn--primary'
                                : 'btn btn--primary btn--disabled'
                            }
                            children="Export Course Data"
                            role="button"
                            onClick={this.exportCourseData}
                        />
                    </Flex>
                </FilterRow>
                <Header cells={this.headerCells} />
                { paginate(this.relevantUsers, this.visibleRows, this.page)
                    .map((user: ALiEMU.EducatorDashboard.UserMeta, i: number) => (
                        <Row key={user.ID} id={`course-table-row-${i}`}>
                            <Cell
                                align="left"
                                children={user.displayName}
                            />
                            <Cell
                                align="left"
                                children={unix(user.courseCompleted[this.courseSelection]).calendar()}
                            />
                        </Row>
                    ))
                }
                { this.courseSelection !== '' && (
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
