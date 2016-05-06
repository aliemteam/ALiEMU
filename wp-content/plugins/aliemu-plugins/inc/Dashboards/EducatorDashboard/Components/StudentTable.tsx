import * as React from 'react';
import calculateIIIHours from './Utils/CalculateHours';
import paginate from '../../../Components/Utils/Pagination';
import {
  Header,
  Row,
  Cell,
  Pager,
  FilterRow,
  Flex,
  Button
} from '../../../Components/TableComponents';


interface Props {
  users: ALiEMU.EducatorDashboard.UserObject
  courseMeta: ALiEMU.EducatorDashboard.CourseMetaObject
}

interface State {
  currentPage: number
  visibleRows: number
  advancedFilter: boolean
}

export class StudentTable extends React.Component<Props, State> {

  public totalStudents: number = Object.keys(this.props.users).length;
  public headerProps = [
    { content: 'Full Name', centered: false },
    { content: 'Class', centered: false },
    { content: 'Total III Hours', centered: true },
    { content: 'User Export', centered: true },
  ];

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      currentPage: 0,
      visibleRows: 10,
      advancedFilter: false,
    });
  }

  paginate(e: React.UIEvent) {
    let currentPage = parseInt((e.target as HTMLSpanElement).innerText) - 1;
    this.setState(Object.assign({}, this.state, { currentPage }));
  }

  rowSelect(e: React.UIEvent) {
    let selection = (e.target as HTMLSelectElement).value;
    let visibleRows = selection === 'all' ? this.totalStudents : selection;
    this.setState(Object.assign({}, this.state, { visibleRows }));
  }

  toggleAdvancedFilter(e: React.UIEvent) {
    this.setState(
      Object.assign({}, this.state, { advancedFilter: !this.state.advancedFilter })
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
              style={{ margin: '0 5px' }}
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
              id='search-query' />
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
            <Button value='Export Program Data' />
          </div>
        </FilterRow>

        {/* Date query row */}
        { this.state.advancedFilter &&
          <FilterRow>
            <Flex amount='1'>
              <strong>From:</strong>
              <input type='text'
              id='filter-from-year'
              style={{
                height: '30px !important',
                fontSize: '1em',
                padding: '2px',
                marginLeft: '5px !important',
                maxWidth: '200px',
              }} />
              <strong>to</strong>
              <input type="text"
              id="filter-to-year"
              style={{
                height: '30px !important',
                fontSize: '1em',
                padding: '2px',
                marginLeft: '5px !important',
                maxWidth: '200px',
              }} />
              <Button value="Recalculate" />
            </Flex>
          </FilterRow>
        }

        {/* Table */}
        <Header cells={this.headerProps} />
        {
          paginate(this.props.users, this.state.visibleRows, this.state.currentPage)
          .map((uid, i) =>
            <TableBody
              key={uid}
              name={this.props.users[uid].displayName}
              classOf={this.props.users[uid].auGraduationYear}
              hours={calculateIIIHours(this.props.users[uid], this.props.courseMeta)} />
          )
        }

        {/* Pagination Buttons */}
        <Pager
          totalRows={this.totalStudents}
          currentPage={this.state.currentPage}
          visibleRows={this.state.visibleRows}
          onClick={this.paginate.bind(this)} />
      </div>
    )
  }
}


const TableBody = ({
  name,
  classOf,
  hours
}) =>
<Row>
  <Cell align='left'>{name}</Cell>
  <Cell align='left'>{classOf}</Cell>
  <Cell align='center'>{hours}</Cell>
  <Cell align='center'><Button value='Export Data' /></Cell>
</Row>
