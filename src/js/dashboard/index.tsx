import * as React from 'react';

import Dashboard from './dashboard';

export interface Globals {
    current_user: WordPress.User<'edit'> | null;
    profile_user: WordPress.User;
}

export const enum UserKind {
    OWNER = 'owner',
    VISITOR = 'visitor',
}

export const UserContext = React.createContext<UserKind>(UserKind.VISITOR);

declare const AU_Dashboard: Globals;

export default (): JSX.Element => {
    const user: UserKind =
        AU_Dashboard.current_user !== null &&
        AU_Dashboard.current_user.id === AU_Dashboard.profile_user.id
            ? UserKind.OWNER
            : UserKind.VISITOR;
    return (
        <UserContext.Provider value={user}>
            <Dashboard user={user} />
        </UserContext.Provider>
    );
};
