import * as React from 'react';
import DevTools from 'utils/dev-tools';
import { CourseTable } from './CourseTable';
import { StudentTable } from './StudentTable';

interface Props {
    data: ALiEMU.EducatorDashboard.EducatorData;
}

export class EducatorDashboard extends React.Component<Props, {}> {
    render(): JSX.Element {
        return (
            <div>
                <DevTools />
                <div className="au-edudash-shadowbox">
                    <h1>
                        {this.props.data.currentUser.meta.residencyUsEm}
                    </h1>
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
