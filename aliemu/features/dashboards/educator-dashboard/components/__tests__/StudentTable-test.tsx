jest.unmock('../StudentTable');
jest.unmock('../../../../components/TableComponents');
jest.unmock('../../../../utils/Pagination');
jest.unmock('moment');

import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { users, courseData, createMinimalUser } from '../../../../../../lib/utils/Fixtures';
import { CSV } from '../../../../utils/DashboardUtils';
import { StudentTable } from '../StudentTable';

const setup = (USERS = users, COURSEDATA = courseData) => {
    const component = mount(
        <StudentTable users={USERS} courseData={COURSEDATA} />
    );
    return {
        component,
        firstRow: component.find('#student-table-row-0'),
        secondRow: component.find('#student-table-row-1'),
        select: component.find('#row-select'),
        filterToggle: component.find('#advanced-filter-toggle'),
        pager: component.find('#pager'),
        textFilter: component.find('#search-query'),
        exportBtn: component.find('#program-export'),
    };
};

describe('<StudentTable />', () => {
    it('should display users in the correct order on load', () => {
        let { firstRow, secondRow } = setup();
        expect(firstRow.children().first().props().children).toBe('Maximal User');
        let userdata = {
            23: createMinimalUser(23, 2006),
            24: createMinimalUser(24, 2014),
            35: createMinimalUser(35, 1995),
            46: createMinimalUser(46, 2015),
            47: createMinimalUser(47, null),
            48: createMinimalUser(48, null),
            58: createMinimalUser(58, 2000),
            59: createMinimalUser(59, 2000),
            60: createMinimalUser(60, 2000),
            61: createMinimalUser(61, 2000),
            69: createMinimalUser(69, 2002),
        };

        ({ firstRow, secondRow } = setup(userdata));
        expect(firstRow.children().first().props().children).toBe('User 46');
        expect(secondRow.children().first().props().children).toBe('User 24');
    });
    describe('Row visibility manipulation', () => {
        it('should render with only 10 as an option with less than 10 users', () => {
            const { select } = setup();
            expect(select.props().defaultValue).toBe('10');
            expect(select.children().length).toBe(1);
        });

        it('should render with 10 and "all" as options with > 10 users', () => {
            const userdata = {};
            for (let i = 0; i < 15; i++) {
                userdata[i] = createMinimalUser(i, 2016);
            }
            const { select } = setup(userdata);
            expect(select.children().length).toBe(2);
        });

        it('should render with 10, 25, and "all" as options with > 25 users', () => {
            const userdata = {};
            for (let i = 0; i < 28; i++) {
                userdata[i] = createMinimalUser(i, 2016);
            }
            const { select } = setup(userdata);
            expect(select.children().length).toBe(3);
        });

        // Save this large version to use for further tests below
        const userdata = {};
        for (let i = 0; i < 51; i++) {
            userdata[i] = createMinimalUser(i, 2016);
        }

        it('should render with 10, 25, 50, and "all" as options with > 50 users', () => {
            const { select } = setup(userdata);
            expect(select.children().length).toBe(4);
        });

        it('should toggle row visibility onChange', () => {
            const { select, component } = setup(userdata);
            expect(component.state().visibleRows).toBe(10);
            expect(component.find('.table-row').length).toBe(10);
            select.simulate('change', { target: { value: 25 }});
            expect(component.state().visibleRows).toBe(25);
            expect(component.find('.table-row').length).toBe(25);
            select.simulate('change', { target: { value: 10 }});
            expect(component.state().visibleRows).toBe(10);
            expect(component.find('.table-row').length).toBe(10);
            select.simulate('change', { target: { value: 50 }});
            expect(component.state().visibleRows).toBe(50);
            expect(component.find('.table-row').length).toBe(50);
            select.simulate('change', { target: { value: 'all' }});
            expect(component.state().visibleRows).toBe(51);
            expect(component.find('.table-row').length).toBe(51);
        });
    });

    describe('Text filter manipulation', () => {
        it('should filter to show only a single matched user by name', () => {
            const userdata = {};
            for (let i = 0; i < 40; i++) {
                userdata[i] = createMinimalUser(i, 40 - i);
            }
            const { component, textFilter } = setup(userdata);
            expect(component.state().visibleRows).toBe(10);
            expect(component.find('.table-row').length).toBe(10);
            expect(component.find('.table-row').filterWhere(n => n.children().first().props().children === 'User 0').length).toBe(1);
            expect(component.find('.table-row').filterWhere(n => n.children().first().props().children === 'User 32').length).toBe(0);

            textFilter.simulate('change', { target: { value: 'UsEr 32'}});

            expect(component.state().filter).toBe('user 32');
            expect(component.find('.table-row').length).toBe(1);
            expect(component.find('.table-row').filterWhere(n => n.children().first().props().children === 'User 0').length).toBe(0);
            expect(component.find('.table-row').filterWhere(n => n.children().first().props().children === 'User 32').length).toBe(1);

            textFilter.simulate('change', { target: { value: ''}});
            expect(component.state().filter).toBe('');
            expect(component.find('.table-row').first().children().at(0).props().children).toBe('User 0');
        });

        it('should filter to show only a single matched user by graduation year', () => {
            const userdata = {
                23: createMinimalUser(23, 2006),
                24: createMinimalUser(24, 2014),
                35: createMinimalUser(35, 1995),
                46: createMinimalUser(46, 2015),
                47: createMinimalUser(47, null),
                48: createMinimalUser(48, null),
                58: createMinimalUser(58, 2000),
                59: createMinimalUser(59, 2000),
                60: createMinimalUser(60, 2000),
                61: createMinimalUser(61, 2000),
                69: createMinimalUser(69, 2002),
            };
            const { component, textFilter } = setup(userdata);
            expect(component.state().visibleRows).toBe(10);
            expect(component.find('.table-row').length).toBe(10);
            expect(component.find('.table-row').children().at(0).props().children).toBe('User 46');

            textFilter.simulate('change', { target: { value: '1995'}});

            expect(component.find('.table-row').length).toBe(1);
            expect(component.find('.table-row').children().at(0).props().children).toBe('User 35');

            textFilter.simulate('change', { target: { value: ''}});
            expect(component.find('.table-row').length).toBe(10);
            expect(component.find('.table-row').children().at(0).props().children).toBe('User 46');
        });
    });

    describe('Advanced filter manipulation', () => {
        it('should render icon with className "um-faicon-caret-down" on load', () => {
            const { component, filterToggle } = setup();
            expect(filterToggle.children().first().props().className).toBe('um-faicon-caret-down');
            expect(component.state().advancedFilter).toBe(false);
        });

        it('should change icon className to "um-faicon-caret-up" on click', () => {
            const { component, filterToggle } = setup();
            filterToggle.simulate('click');
            expect(filterToggle.children().first().props().className).toBe('um-faicon-caret-up');
            expect(component.state().advancedFilter).toBe(true);
        });

        it('should change the date when a date filter is chosen', () => {
            const { component, filterToggle } = setup();
            const spy = sinon.spy(StudentTable.prototype, 'selectDate');
            filterToggle.simulate('click');
            const start = (component as any).ref('datepicker');
            start.props().onChange();
            expect(spy.callCount).toBe(1);
            spy.reset();
        });
    });

    describe('Pagination tests', () => {
        it('render with 3 pager buttons', () => {
            const userdata = {};
            for (let i = 0; i < 30; i++) {
                userdata[i] = createMinimalUser(i, 2016);
            }
            const { pager } = setup(userdata);
            expect(pager.children().length).toBe(3);
        });

        const userdata = {};
        for (let i = 0; i < 51; i++) {
            userdata[i] = createMinimalUser(i, 50 - i);
        }

        it('should navigate to the correct page when clicked', () => {
            const { component, pager } = setup(userdata);
            expect(pager.children().length).toBe(6);
            expect(pager.children().first().props().className).toBe('au-edudash-pager-btn-active');
            expect(component.state().currentPage).toBe(0);
            const page4 = pager.children().at(3);
            expect(page4.props().children).toBe(4);
            page4.simulate('click');
            expect(component.state().currentPage).toBe(3);
            expect(page4.props().className).toBe('au-edudash-pager-btn-active');
            expect(pager.children().first().props().className).toBe('au-edudash-pager-btn');
            expect(component.children().at(3).children().first().props().children).toBe('User 30');
        });
    });

    describe('Export CSV functions', () => {
        it('should call exportCSV for global program export', () => {
            const stub = sinon.stub(CSV.prototype, 'allUsers', () => ({filename: 'test.csv', data: 'test,test,test'}));
            const { exportBtn } = setup();
            exportBtn.simulate('click');
            stub.restore();
        });

        it('should call exportCSV for user-level export', () => {
            const stub = sinon.stub(CSV.prototype, 'user', () => ({filename: 'test.csv', data: 'test,test,test'}));
            const { component } = setup();
            const user1Export = component.find('#student-table-row-0').children().at(4).children();
            const user2Export = component.find('#student-table-row-1').children().at(4).children();
            user1Export.simulate('click');
            user2Export.simulate('click');
            stub.restore();
        });

        it('should alert the user when the student has no course interactions', () => {
            const stub = sinon.stub(CSV.prototype, 'user', () => false);
            const { component } = setup();
            const spy = sinon.spy(window, 'alert');
            const userExport = component.find('#student-table-row-1').children().at(4).children();
            userExport.simulate('click');
            expect(spy.callCount).toBe(1);
            spy.reset();
            stub.restore();
        });
    });
});
