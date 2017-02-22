import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import WPGraphQL, { User } from 'wp-graphql';
import { CourseTable } from './CourseTable';
import { StudentTable } from './StudentTable';
// import DevTools from 'mobx-react-devtools';

declare const _AU_API;

const transport = new WPGraphQL(_AU_API.root, {
    nonce: _AU_API.nonce,
    postTypes: [
        { name: 'course', namePlural: 'courses', restBase: 'sfwd-courses' },
        { name: 'lesson', namePlural: 'lessons', restBase: 'sfwd-lessons' },
    ],
});

interface Response {
    me: Pick<User, 'id'|'name'|'meta'>;
}

@observer
export class EducatorDashboard extends React.Component<{}, {}> {

    @observable groupName = '';
    @observable loading = true;
    groupMembers = observable.shallowArray<number>([]);

    async componentDidMount() {
        const data = await transport.send<Response>(`
            {
                me {
                    id
                    name
                    meta
                }
            }
        `);
        this.init(data);
    }

    @action
    init(data) {
        this.groupMembers.replace(data.me.meta.group.members);
        this.groupName = data.me.meta.group.id; // FIXME: This will need to be changed eventually
        this.loading = false;
    }

    render() {
        if (this.loading) {
            return <h1>Loading...</h1>;
        }
        return (
            <div>
                {/* <DevTools position={{right: 50, top: 100}}/> */}
                <div className="au-edudash-shadowbox">
                    <h1>{this.groupName}</h1>
                </div>
                <StudentTable
                    users={this.groupMembers}
                />
                <CourseTable
                    users={this.groupMembers}
                />
            </div>
        );
    }
}
