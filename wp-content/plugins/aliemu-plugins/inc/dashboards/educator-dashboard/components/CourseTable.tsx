import * as React from 'react';
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
    FilterRow,
    Flex,
    Button,
    Pager,
} from '../../../components/TableComponents';

interface Props {
    courseData: ALiEMU.EducatorDashboard.CourseData;
    users: ALiEMU.EducatorDashboard.UserObject;
}

interface State {
    categories: string[];
    categorySelection: string;
    courseSelection: string;
    currentPage: number;
    visibleRows: number;
    relevantUsers: ALiEMU.EducatorDashboard.UserMeta[];
}

export class CourseTable extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            categories: Object.keys(this.props.courseData.categories).filter((category) => category !== ''),
            categorySelection: '',
            courseSelection: '',
            currentPage: 0,
            visibleRows: 10,
            relevantUsers: [],
        };
    }

    exportCourseData(e: DOMEvent) {
        const course = this.state.courseSelection;

        if (!course) return;

        const filename = `${this.props.courseData.courses[course].postTitle}.csv`;
        const lessons = this.props.courseData.lessons;
        const users = this.props.users;
        const lessonIDs = [];

        let CSV: string = `Last Name,First Name,Course Completed,${
            this.props.courseData.courses[course].lessons
            .filter((lessonID: string) => typeof lessons[lessonID] !== 'undefined')
            .map((lessonID: string) => {
                lessonIDs.push(lessonID);
                return `"Lesson: ${lessons[lessonID].postTitle}"`;
            })
            .join(',')
        }\n`;

        /** TODO: Probably put this in a function */
        Object.keys(users).forEach((userID: string) => {
            CSV +=
                `"${users[userID].lastName}",` +
                `"${users[userID].firstName}",` +
                `"${parseCompletionDate(users[userID].courseCompleted[this.state.courseSelection])}",` +
                `${lessonIDs.map((lessonID: string) => {
                    try {
                        let completed = users[userID].courseProgress[course].lessons[lessonID];
                        if (completed === 1) {
                            return '"Completed"';
                        }
                        return '"X"';
                    } catch(e) {
                        return '"X"';
                    }
                }).join(',')}\n`;
        });

        const blob = new Blob(
            [CSV, ], { type: 'text/csv;charset=utf-8', }
        );

        downloadPolyfill(filename, blob, browserDetect(), e.target.id);
    }

    handleChange(e: React.UIEvent) {
        let newValue = (e.target as HTMLSelectElement).value;
        let target = ((e.target as HTMLSelectElement).id);
        let newState: State;

        switch (target) {
            case 'category':
                newState = Object.assign({}, this.state, { categorySelection: newValue, });
                break;
            case 'course':
                let courseID = (e.target as HTMLSelectElement).value;
                let newStateUsers: ALiEMU.EducatorDashboard.UserMeta[] = [];

                for (let userID in this.props.users) {
                    if (this.props.users[userID].courseCompleted[courseID]) {
                        newStateUsers.push(this.props.users[userID]);
                    }
                }
                newState = Object.assign({}, this.state, {
                    courseSelection: newValue,
                    relevantUsers: newStateUsers,
                });
                break;
        }

        this.setState(newState);
    }

    paginate(e: React.UIEvent) {
        let currentPage = parseInt((e.target as HTMLSpanElement).innerText) - 1;
        this.setState(Object.assign({}, this.state, { currentPage, }));
    }

    render() {
        return (
            <div className='au-edudash-shadowbox'>
                <h2>Course Overview</h2>
                <FilterRow>
                    <Flex amount='1'>
                        <select
                            id='category'
                            style={{ width: '95%', }}
                            onChange={this.handleChange.bind(this)}
                            defaultValue='' >
                            <option value=''> -- Select a Category -- </option>
                            {
                                this.state.categories.map((category: string, i: number) =>
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
                            style={{ width: '95%', }}
                            defaultValue=''
                            onChange={this.handleChange.bind(this)}
                            disabled={this.state.categorySelection === ''} >
                            <option value=''> -- Select a Course -- </option>
                            {
                                Object.keys(this.props.courseData.categories[this.state.categorySelection]).map((courseID, i) =>
                                    <option value={courseID} key={courseID}>
                                        {this.props.courseData.courses[courseID].postTitle}
                                    </option>
                                )
                            }
                        </select>
                    </Flex>
                    <Flex amount='1'>
                        <Button
                            children='Export Course Data'
                            disabled={true}
                            onClick={this.exportCourseData.bind(this)} />
                    </Flex>
                </FilterRow>
                <Header cells={this.headerCells} />
                {
                    this.state.relevantUsers.filter((user, i: number) => {
                        let vr = this.state.visibleRows;
                        let cp = this.state.currentPage;
                        return ((vr * cp) <= i && i < (vr * cp + vr));
                    })
                    .map((user: ALiEMU.EducatorDashboard.UserMeta, i: number) =>
                        <Row key={user.ID}>
                            <Cell align='left'>{user.displayName}</Cell>
                            <Cell align='left'>
                            {
                                new Date(
                                    parseInt(user.courseCompleted[this.state.courseSelection] + '000')
                                ).toLocaleDateString()
                            }
                            </Cell>
                        </Row>
                    )
                }
                { this.state.courseSelection !== '' &&
                    <Pager
                        visibleRows={this.state.visibleRows}
                        currentPage={this.state.currentPage}
                        totalRows={this.state.relevantUsers.length}
                        onClick={this.paginate.bind(this)} />
                }
            </div>
        );
    }

    private headerCells = [
        { content: 'User Name', centered: false, },
        { content: 'Course Completion Date', centered: false, },
    ];
}
