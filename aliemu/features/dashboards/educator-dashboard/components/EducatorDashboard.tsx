import * as React from 'react';
import { CourseTable } from './CourseTable';
import { StudentTable } from './StudentTable';
// import DevTools from 'mobx-react-devtools';

interface Props {
    data: ALiEMU.EducatorDashboard.EducatorData;
}

export class EducatorDashboard extends React.Component<Props, {}> {
    render() {
        return (
            <div>
                {/* <DevTools position={{right: 50, top: 100}}/> */}
                <div className="au-edudash-shadowbox">
                    <h1>{this.props.data.currentUser.meta.residencyUsEm}</h1>
                </div>
                <StudentTable
                    users={this.props.data.users}
                    courseData={this.props.data.courseData}
                />
                <CourseTable
                    users={this.props.data.users}
                    courseData={this.props.data.courseData}
                />
            </div>
        );
    }
}
