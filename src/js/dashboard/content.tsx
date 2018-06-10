import { observer } from 'mobx-react';
import * as React from 'react';

import * as styles from './content.scss';

import { Tabs } from './dashboard';
import { TabGroups, TabHome, TabProfile, TabProgress } from './tabs/';

interface Props {
    getCurrentTab(): Tabs;
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
        switch (this.props.getCurrentTab()) {
            case Tabs.HOME:
                return <TabHome />;
            case Tabs.PROFILE:
                return <TabProfile />;
            case Tabs.PROGRESS:
                return <TabProgress />;
            case Tabs.GROUPS:
                return <TabGroups />;
            default:
                return <h1>Error</h1>;
        }
    }
}
