import { observer } from 'mobx-react';
import * as React from 'react';

import { Tabs } from 'dashboard/dashboard';
import UserStore, { UserKind } from 'dashboard/user-store';

import { Navbar, NavGroup, NavTab } from 'components/navbar/';

interface Props {
    store: UserStore;
    getCurrentTab(): Tabs;
    onClick(e: React.MouseEvent<HTMLButtonElement>): void;
}

@observer
export default class DashboardNavbar extends React.Component<Props> {
    render(): JSX.Element {
        const { getCurrentTab, onClick, store } = this.props;
        const tab = getCurrentTab();
        const isOwner = store.userKind === UserKind.OWNER;
        return (
            <Navbar>
                <NavGroup>
                    {isOwner && (
                        <NavTab
                            data-tab={Tabs.HOME}
                            active={tab === Tabs.HOME}
                            onClick={onClick}
                        >
                            Home
                        </NavTab>
                    )}
                    <NavTab
                        data-tab={Tabs.PROFILE}
                        active={tab === Tabs.PROFILE}
                        onClick={onClick}
                    >
                        Profile
                    </NavTab>
                    {isOwner && (
                        <NavTab
                            data-tab={Tabs.PROGRESS}
                            active={tab === Tabs.PROGRESS}
                            onClick={onClick}
                        >
                            Progress
                        </NavTab>
                    )}
                    {isOwner && (
                        <NavTab
                            data-tab={Tabs.GROUPS}
                            active={tab === Tabs.GROUPS}
                            onClick={onClick}
                        >
                            Groups
                        </NavTab>
                    )}
                </NavGroup>
            </Navbar>
        );
    }
}
