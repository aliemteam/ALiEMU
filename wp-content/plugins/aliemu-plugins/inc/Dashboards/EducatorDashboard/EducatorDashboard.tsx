import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StudentTable } from './Components/StudentTable';
import { CourseTable } from './Components/CourseTable';

declare var AU_EducatorData: ALiEMU.EducatorDashboard.EducatorData

interface Props {
  data: ALiEMU.EducatorDashboard.EducatorData
}

interface State {
  data: ALiEMU.EducatorDashboard.EducatorData
}

class EducatorDashboard extends React.Component<Props, any> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Heading />
        <StudentTable
          users={this.props.data.users}
          courseMeta={this.props.data.courseData.courseMeta } />
        <CourseTable
          users={this.props.data.users}
          courses={this.props.data.courseData.courses}
          categories={this.props.data.courseData.categories} />
      </div>
    );
  }

}


const Heading = ({

}) => {
  return (
    <div className='au-edudash-shadowbox'>
      <h1>{AU_EducatorData.currentUser.meta.residencyUsEm}</h1>
    </div>
  );
}


ReactDOM.render(
  <EducatorDashboard data={AU_EducatorData}/>,
  document.getElementById('educator-dashboard')
);
