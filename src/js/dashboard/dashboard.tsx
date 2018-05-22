import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import DevTool from 'utils/dev-tools';
import { User } from './';

import Content from './content';
import Header from './header';
import Navbar from './navbar';

declare const AU_Dashboard: Globals;

export interface Globals {
    current_user: WordPress.User<'edit'> | null;
    nonce: string;
    profile_user: WordPress.User<'view'>;
    recent_comments: number[];
}

export const enum Tabs {
    HOME = 'HOME',
    PROFILE = 'PROFILE',
    GROUPS = 'GROUPS',
}

interface Props {
    /**
     * The type of user visiting the dashboard
     */
    user: User;
}

@observer
export default class Dashboard extends React.Component<Props> {
    @observable
    private _currentTab: Tabs = this.props.user === User.OWNER
        ? Tabs.HOME
        : Tabs.PROFILE;

    getCurrentTab = (): Tabs => this._currentTab;

    render(): JSX.Element {
        const { profile_user } = AU_Dashboard;
        return (
            <>
                <DevTool />
                <Header data={profile_user} />
                <Navbar
                    getCurrentTab={this.getCurrentTab}
                    onClick={this.handleTabClick}
                />
                <Content getCurrentTab={this.getCurrentTab} />
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
