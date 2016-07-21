import * as React from 'react';
import { browserDetect } from '../../../utils/BrowserDetect';
import paginate from '../../../utils/Pagination';
import * as moment from 'moment';
import {
    downloadPolyfill,
    CSV,
} from '../../../utils/DashboardUtils';
import {
    Header,
    Row,
    Cell,
    FilterRow,
    Flex,
    Pager,
} from '../../../components/TableComponents';

interface Props {
    courseData: ALiEMU.EducatorDashboard.CourseData;
    users: ALiEMU.EducatorDashboard.UserObject;
}

interface State {
    categories: string[];
    selections: {
        category: string;
        course: string;
    };
    currentPage: number;
    relevantUsers: ALiEMU.EducatorDashboard.UserMeta[];
}

export class CourseTable extends React.Component<Props, State> {

    public CSV;
    private visibleRows: number;
    private headerCells = [
        { content: 'User Name', align: 'left' },
        { content: 'Course Completion Date', align: 'left' },
    ];

    constructor(props: Props) {
        super(props);
        this.CSV = new CSV(this.props.users, this.props.courseData);
        this.visibleRows = 10;
        this.state = {
            categories: Object.keys(this.props.courseData.categories)
                .filter((category) => category !== ''),
            selections: {
                category: '',
                course: '',
            },
            currentPage: 0,
            relevantUsers: [],
        };
    }

    exportCourseData(e: ALiEMU.DOMEvent) {
        const courseID = this.state.selections.course;
        const CSV = this.CSV.course(courseID);
        const blob = new Blob([CSV.data], {type: 'text/csv;charset=utf-8'});
        downloadPolyfill(CSV.filename, blob, browserDetect(), e.target.id);
    }

    reducer(action: ALiEMU.Action, e?: ALiEMU.DOMEvent) {
        if (e) e.preventDefault();
        switch (action.type) {
            case 'SELECT_CATEGORY': {
                return this.setState(
                    Object.assign({}, this.state, {
                        selections: {
                            category: e.target.value,
                            course: '',
                        },
                        relevantUsers: [],
                    })
                );
            }
            case 'SELECT_COURSE': {
                return this.setState(
                    Object.assign({}, this.state, {
                        selections: Object.assign({}, this.state.selections, {
                            course: e.target.value,
                        }),
                        relevantUsers: Object.keys(this.props.users)
                            .filter(id => this.props.users[id].courseCompleted &&
                                this.props.users[id].courseCompleted.hasOwnProperty(e.target.value))
                            .map(id => this.props.users[id]),
                    })
                );
            }
            case 'PAGINATE': {
                return this.setState(
                    Object.assign({}, this.state, {
                        currentPage: action['page'],
                    })
                );
            }
        }
    }

    render() {
        return (
            <div className='au-edudash-shadowbox'>
                <h2 children='Course Overview' />
                <FilterRow>
                    <Flex amount='1'>
                        <select
                            id='category'
                            style={{width: '95%'}}
                            onChange={this.reducer.bind(this, {type: 'SELECT_CATEGORY'})}
                            defaultValue=''>
                            <option value=''> -- Select a Category -- </option>
                            { this.state.categories.map((category: string, i: number) =>
                                    <option value={category} key={i}>
                                        {category}
                                    </option>
                                )
                            }
                        </select>
                    </Flex>
                    <Flex amount='2'>
                        <select
                            id='course'
                            style={{width: '95%'}}
                            defaultValue=''
                            onChange={this.reducer.bind(this, {type: 'SELECT_COURSE'})}
                            disabled={this.state.selections.category === ''}>
                            <option value=''> -- Select a Course -- </option>
                            { this.state.selections.category &&
                                Object.keys(this.props.courseData.categories[this.state.selections.category]).map((courseID) =>
                                    <option value={courseID} key={courseID}>
                                        {this.props.courseData.courses[courseID].postTitle}
                                    </option>
                                )
                            }
                        </select>
                    </Flex>
                    <Flex amount='1'>
                        <a
                            id='course-export'
                            className={
                                this.state.selections.course !== ''
                                ? 'au-edudash-exportbtn'
                                : 'au-edudash-exportbtn-disabled'
                            }
                            children='Export Course Data'
                            onClick={this.exportCourseData.bind(this)} />
                    </Flex>
                </FilterRow>
                <Header cells={this.headerCells} />
                { paginate(this.state.relevantUsers, this.visibleRows, this.state.currentPage)
                    .map((user: ALiEMU.EducatorDashboard.UserMeta, i: number) =>
                        <Row key={user.ID} id={`course-table-row-${i}`}>
                            <Cell align='left'>{user.displayName}</Cell>
                            <Cell align='left'>
                            {
                                moment.unix(user.courseCompleted[this.state.selections.course]).calendar()
                            }
                            </Cell>
                        </Row>
                    )
                }
                { this.state.selections.course !== '' &&
                    <Pager
                        visibleRows={this.visibleRows}
                        currentPage={this.state.currentPage}
                        totalRows={this.state.relevantUsers.length}
                        onClick={this.reducer.bind(this)} />
                }
            </div>
        );
    }
}
