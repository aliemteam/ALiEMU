import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { ICoach, ILearner } from 'utils/types';

import DevTool from 'utils/dev-tools';
import { UserKind } from './';

import Content from './content';
import Header from './header';
import Navbar from './navbar';

declare const AU_Dashboard: Globals;

export interface Globals {
    current_user: ICoach & ILearner | null;
    profile_user: WordPress.User<'view'>;
    recent_comments: number[];
}

export const enum Tabs {
    GROUPS = 'GROUPS',
    HOME = 'HOME',
    PROFILE = 'PROFILE',
    PROGRESS = 'PROGRESS',
}

interface Props {
    /**
     * The type of user visiting the dashboard
     */
    user: UserKind;
}

@observer
export default class Dashboard extends React.Component<Props> {
    @observable
    private _currentTab: Tabs =
        this.props.user === UserKind.OWNER ? Tabs.PROGRESS : Tabs.PROFILE;

    constructor(props: Props) {
        super(props);
        AU_Dashboard.profile_user = observable(AU_Dashboard.profile_user);
        if (AU_Dashboard.current_user) {
            AU_Dashboard.current_user = observable(AU_Dashboard.current_user);
        }
    }

    getCurrentTab = (): Tabs => this._currentTab;

    render(): JSX.Element {
        const { profile_user, current_user } = AU_Dashboard;
        return (
            <>
                <DevTool />
                <Header data={current_user || profile_user} />
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
