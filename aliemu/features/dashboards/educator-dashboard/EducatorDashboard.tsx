import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StudentTable } from './components/StudentTable';
import { CourseTable } from './components/CourseTable';
import 'react-datepicker/dist/react-datepicker.css';

declare const AU_EducatorData: ALiEMU.EducatorDashboard.EducatorData;

interface Props {
    data: ALiEMU.EducatorDashboard.EducatorData;
}

class EducatorDashboard extends React.Component<Props, {}> {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Heading />
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

const Heading = () =>
<div className="au-edudash-shadowbox">
    <h1>{AU_EducatorData.currentUser.meta.residencyUsEm}</h1>
</div>;

ReactDOM.render(
  <EducatorDashboard data={AU_EducatorData}/>,
  document.getElementById('educator-dashboard')
);
