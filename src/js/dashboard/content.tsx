import { observer } from 'mobx-react';
import React from 'react';

import styles from './content.scss';

import { Tabs } from 'dashboard/dashboard';
import TabGroups from 'dashboard/tabs/groups/';
import TabHome from 'dashboard/tabs/home/';
import TabProfile from 'dashboard/tabs/profile/';
import TabProgress from 'dashboard/tabs/progress/';
import UserStore from 'dashboard/user-store';

interface Props {
    store: UserStore;
    currentTab: Tabs;
}

@observer
export default class DashboardContent extends React.Component<Props> {
    render(): JSX.Element {
        return (
            <div className={styles.body}>
                <div className={styles.bodyContainer}>{this.renderTab()}</div>
            </div>
        );
    }

    private renderTab(): JSX.Element {
        const { currentTab, store } = this.props;
        switch (currentTab) {
            case Tabs.HOME:
                return <TabHome store={store} />;
            case Tabs.PROFILE:
                return <TabProfile store={store} />;
            case Tabs.PROGRESS:
                return <TabProgress store={store} />;
            case Tabs.GROUPS:
                return <TabGroups />;
            default:
                return <h1>Error</h1>;
        }
    }
}
