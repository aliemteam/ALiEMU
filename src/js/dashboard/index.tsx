import * as React from 'react';

import Dashboard from './dashboard';

export interface Globals {
    current_user: WordPress.User<'edit'> | null;
    profile_user: WordPress.User;
}

// TODO: should this instead be a const enum?
// export type User = 'owner' | 'visitor';
export const enum User {
    OWNER = 'owner',
    VISITOR = 'visitor',
}

export const UserContext = React.createContext<User>(User.VISITOR);

declare const AU_Dashboard: Globals;

export default (): JSX.Element => {
    const user: User =
        AU_Dashboard.current_user !== null &&
        AU_Dashboard.current_user.id === AU_Dashboard.profile_user.id
            ? User.OWNER
            : User.VISITOR;
    return (
        <UserContext.Provider value={user}>
            <Dashboard user={user} />
        </UserContext.Provider>
    );
};
