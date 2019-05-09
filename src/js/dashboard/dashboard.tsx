import React, { useState } from 'react';

import UserStore, { UserKind } from 'dashboard/user-store';
import DevTool from 'utils/dev-tools';
import { Coach, Learner } from 'utils/types';

import Content from './content';
import Header from './header';
import Navbar from './navbar';

export interface Globals {
    recent_comments: number[];
    user: Coach & Learner;
}

export const enum Tabs {
    GROUPS = 'GROUPS',
    HOME = 'HOME',
    PROFILE = 'PROFILE',
    PROGRESS = 'PROGRESS',
}

declare const AU_Dashboard: Globals;

const store = new UserStore(AU_Dashboard.user, AU_Dashboard.recent_comments);

function Dashboard() {
    const [currentTab, setCurrentTab] = useState(
        store.userKind === UserKind.OWNER ? Tabs.HOME : Tabs.PROFILE,
    );

    return (
        <>
            <DevTool />
            <Header store={store} />
            <Navbar
                currentTab={currentTab}
                store={store}
                onTabClick={setCurrentTab}
            />
            <Content currentTab={currentTab} store={store} />
        </>
    );
}

export default Dashboard;
