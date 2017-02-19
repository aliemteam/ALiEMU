import * as React from 'react';
import WPGraphQL from 'wp-graphql';
import { CourseTable } from './CourseTable';
import { StudentTable } from './StudentTable';
// import DevTools from 'mobx-react-devtools';

declare const _AU_API;


interface Props {
    data: ALiEMU.EducatorDashboard.EducatorData;
}

export class EducatorDashboard extends React.Component<Props, {}> {
    componentDidMount() {
        const transport = new WPGraphQL(_AU_API.root, { nonce: _AU_API.nonce });
        let me;
        transport.send(`
            {
                me {
                    first_name
                    last_name
                    name
                    id
                    nickname
                    slug
                    meta
                }
            }
        `).then(d => {
            me = d.me;
            return transport.send(`
                query userQuery($users: [Int], $n: Int) {
                    users(include: $users, per_page: $n) {
                        id
                        name
                        meta
                    }
                }
            `, { users: me.meta.group.members, n: me.meta.group.members.length });
        }).then(d => {
            console.log({
                me,
                ...d,
            });
        });
    }
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
