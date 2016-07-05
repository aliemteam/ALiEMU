jest.unmock('../CourseTable');
jest.unmock('../../../../utils/BrowserDetect');
jest.unmock('../../../../utils/Pagination');
jest.unmock('../../../../components/TableComponents');
jest.unmock('moment');

import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { users, courseData, createMinimalUser } from '../../../../../../test-utils/Fixtures';
import { CSV } from '../../../../utils/DashboardUtils';
import { CourseTable } from '../CourseTable';

sinon.stub(CSV.prototype, 'course', () => ({filename: 'asd', data: 'asd'}));

const setup = (USERS = users) => {
    const component = mount(
        <CourseTable users={USERS} courseData={courseData} />
    );
    return {
        component,
        categorySelect: component.find('#category'),
        courseSelect: component.find('#course'),
        exportBtn: component.find('#course-export'),
    };
};

describe('<CourseTable />', () => {
    describe('Initial Render', () => {
        it('should render with course selection disabled', () => {
            const { courseSelect, component } = setup();
            expect(courseSelect.props().disabled).toBe(true);
            expect(component.state().selections.course).toBe('');
        });
        it('should render with export button disabled', () => {
            const { exportBtn } = setup();
            expect(exportBtn.props().className).toBe('au-edudash-exportbtn-disabled');
        });
        it('should render with no visible rows', () => {
            const { component } = setup();
            expect(component.find('#course-table-row-0').length).toBe(0);
        });
    });

    describe('Category interactions', () => {
        it('should save selection to state on change', () => {
            const { categorySelect, component } = setup();
            expect(component.state().selections.category).toBe('');
            categorySelect.simulate('change', { target: { value: 'AIR' }});
            expect(component.state().selections.category).toBe('AIR');
        });
        it('should enable course selection once category is selected', () => {
            const { categorySelect, component } = setup();
            expect(component.find('#course').props().disabled).toBe(true);
            categorySelect.simulate('change', { target: { value: 'AIR'}});
            expect(component.find('#course').props().disabled).toBe(false);
        });
    });

    describe('Course interactions', () => {
        it('should save selection to state on change', () => {
            const { component, courseSelect, categorySelect } = setup();
            categorySelect.simulate('change', { target: { value: 'AIR'}});
            expect(component.state().selections.course).toBe('');
            courseSelect.simulate('change', { target: { value: '200'}});
            expect(component.state().selections.course).toBe('200');
        });
        it('should show users who completed the course on selection', () => {
            const { component, courseSelect, categorySelect } = setup();
            categorySelect.simulate('change', { target: { value: 'AIR'}});
            expect(component.state().selections.course).toBe('');
            courseSelect.simulate('change', { target: { value: '100'}});
            expect(component.find('#course-table-row-0').children().at(0).props().children).toBe('Maximal User');
        });
    });

    describe('Pagination interactions', () => {
        const userdata = {};
        for (let i = 0; i < 15; i++) {
            userdata[i] = createMinimalUser(i, 2016);
            userdata[i].courseCompleted = {
                200: 1433879463,
            };
        }
        it('should not render pager until needed', () => {
            const { component } = setup();
            expect(component.find('.au-edudash-pager').length).toBe(0);
        });
        it('should paginate', () => {
            const { component, courseSelect, categorySelect } = setup(userdata);
            categorySelect.simulate('change', { target: { value: 'AIR'}});
            courseSelect.simulate('change', { target: { value: '200'}});
            const pager = component.find('.au-edudash-pager');
            expect(component.children().length).toBe(14);
            expect(pager.children().length).toBe(2);
            expect(pager.children().at(0).props().className).toBe('au-edudash-pager-btn-active');
            expect(pager.children().at(1).props().className).toBe('au-edudash-pager-btn');
            expect(component.state().currentPage).toBe(0);
            pager.children().at(1).simulate('click');
            expect(component.state().currentPage).toBe(1);
            expect(pager.children().at(0).props().className).toBe('au-edudash-pager-btn');
            expect(pager.children().at(1).props().className).toBe('au-edudash-pager-btn-active');
        });
    });

    describe('Export button interactions', () => {
        const userdata = {};
        for (let i = 0; i < 15; i++) {
            userdata[i] = createMinimalUser(i, 2016);
            userdata[i].courseCompleted = {
                100: 1433879463,
            };
            if (i > 10) {
                userdata[i].courseProgress[100] = {
                    lessons: {
                        110: 1,
                        120: 1,
                    },
                };
            }
        }
        it('should export data on click', () => {
            const { component, categorySelect, courseSelect, exportBtn } = setup(userdata);
            categorySelect.simulate('change', { target: { value: 'AIR'}});
            courseSelect.simulate('change', { target: { value: '100'}});
            exportBtn.simulate('click');
        });
    });
});
