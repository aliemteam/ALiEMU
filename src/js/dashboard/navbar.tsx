import { observer } from 'mobx-react';
import * as React from 'react';

import { User, UserContext } from './';

import { Navbar, NavGroup, NavTab } from 'components/navbar/';
import { Tabs } from './dashboard';

interface Props {
    user: User;
    getCurrentTab(): Tabs;
    onClick(e: React.MouseEvent<HTMLButtonElement>): void;
}

@observer
class DashboardNavbar extends React.Component<Props> {
    render(): JSX.Element {
        const { getCurrentTab, onClick, user } = this.props;
        const tab = getCurrentTab();
        const isOwner = user === User.OWNER;
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

export default (props: Omit<Props, 'user'>): JSX.Element => (
    <UserContext.Consumer>
        {(user: User): JSX.Element => (
            <DashboardNavbar {...props} user={user} />
        )}
    </UserContext.Consumer>
);
