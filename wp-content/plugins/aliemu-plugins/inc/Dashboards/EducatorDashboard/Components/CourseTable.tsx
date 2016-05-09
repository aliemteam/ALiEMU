import * as React from 'react';
import {
    Header,
    Row,
    Cell,
    FilterRow,
    Flex,
    Button,
    Pager,
} from '../../../Components/TableComponents';

interface Props {
    categories: ALiEMU.EducatorDashboard.CategoryObject;
    courses: ALiEMU.EducatorDashboard.CourseObject;
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
    }

    componentWillMount() {
        this.setState({
            categories: Object.keys(this.props.categories).filter((category) => category !== ''),
            categorySelection: '',
            courseSelection: '',
            currentPage: 0,
            visibleRows: 10,
            relevantUsers: [],
        });
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
                                Object.keys(this.props.categories[this.state.categorySelection]).map((courseID, i) =>
                                    <option value={courseID} key={courseID}>
                                        {this.props.courses[courseID].postTitle}
                                    </option>
                                )
                            }
                        </select>
                    </Flex>
                    <Flex amount='1'>
                        <Button
                            value='Export Course Data'
                            disabled={true} />
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
