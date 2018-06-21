import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import UserStore, { UserKind } from 'dashboard/user-store';
import DevTool from 'utils/dev-tools';
import { ICoach, ILearner } from 'utils/types';

import Content from './content';
import Header from './header';
import Navbar from './navbar';

export interface Globals {
    user: ICoach & ILearner;
    recent_comments: number[];
}

export const enum Tabs {
    GROUPS = 'GROUPS',
    HOME = 'HOME',
    PROFILE = 'PROFILE',
    PROGRESS = 'PROGRESS',
}

declare const AU_Dashboard: Globals;

@observer
export default class Dashboard extends React.Component {
    store: UserStore;

    @observable private _currentTab: Tabs;

    constructor(props: {}) {
        super(props);
        const { user } = AU_Dashboard;
        this.store = new UserStore(user);
        this._currentTab =
            this.store.userKind === UserKind.OWNER
                ? Tabs.PROGRESS
                : Tabs.PROFILE;
    }

    getCurrentTab = (): Tabs => this._currentTab;

    render(): JSX.Element {
        return (
            <>
                <DevTool />
                <Header store={this.store} />
                <Navbar
                    store={this.store}
                    getCurrentTab={this.getCurrentTab}
                    onClick={this.handleTabClick}
                />
                <Content
                    getCurrentTab={this.getCurrentTab}
                    store={this.store}
                />
            </>
        );
    }

    @action
    private handleTabClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const tab = e.currentTarget.dataset.tab as Tabs | undefined;
        if (tab && tab !== this._currentTab) {
            this._currentTab = tab;
        }
    };
}
