import { createContext, useCallback, useContext, useState } from '@wordpress/element';
import { cloneDeep } from 'lodash';

import { MessageContext } from 'components/message-hub';
import useQueryParam from 'hooks/use-query-param';
import { CurrentUser } from 'utils/api';

import Content from './content';
import Header from './header';
import Navbar from './navbar';

declare const AU_Dashboard: {
    recent_comments: number[];
    user: CurrentUser.User;
};

interface DashboardContext {
    readonly recentComments: readonly number[];
    readonly user: Readonly<CurrentUser.User>;
    readonly isOwnProfile: boolean;
    updateUser(data: Partial<CurrentUser.User>): Promise<void>;
}

const DEFAULT_CONTEXT: DashboardContext = {
    recentComments: [...AU_Dashboard.recent_comments],
    user: cloneDeep(AU_Dashboard.user),
    isOwnProfile: AU_Dashboard.user.capabilities !== undefined,
    updateUser() {
        throw new Error(
            'DashboardContext: updateUser was not provided by a registered provider.',
        );
    },
};

export type Tab = 'groups' | 'home' | 'profile' | 'progress';

export const DashboardContext = createContext(DEFAULT_CONTEXT);

export default function Dashboard() {
    const [tabQueryParam, setTabQueryParam] = useQueryParam<Tab>(
        'tab',
        DEFAULT_CONTEXT.isOwnProfile ? 'home' : 'profile',
    );
    const [currentTab, setCurrentTab] = useState<Tab>(tabQueryParam);
    const [user, setUser] = useState(cloneDeep(AU_Dashboard.user));

    const { dispatchMessage } = useContext(MessageContext);

    const updateUser = useCallback(
        async (data: Partial<CurrentUser.User>) => {
            setUser({ ...user, ...data });
            try {
                await CurrentUser.update(data);
            } catch {
                dispatchMessage({
                    text: 'Error updating profile information.',
                    intent: 'danger',
                    details:
                        'An unexpected error occurred while attempting to update your profile information. Please try again later.',
                });
                setUser(user);
            }
        },
        [user],
    );

    return (
        <DashboardContext.Provider
            value={{ ...DEFAULT_CONTEXT, user, updateUser }}
        >
            <Header />
            <Navbar
                currentTab={currentTab}
                onTabClick={tab => {
                    setCurrentTab(tab);
                    setTabQueryParam(tab);
                }}
            />
            <Content currentTab={currentTab} />
        </DashboardContext.Provider>
    );
}
