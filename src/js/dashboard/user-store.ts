import { flow, observable, set, toJS } from 'mobx';

import { Users } from 'utils/api';
import { Coach, Learner } from 'utils/types';

export const enum UserKind {
    OWNER = 'owner',
    VISITOR = 'visitor',
}

type ProfileUser = Coach & Learner;

export default class UserStore {
    readonly userKind: UserKind;
    readonly recentComments: number[];

    user: ProfileUser;

    updateUser = flow(function*(this: UserStore, data: Partial<ProfileUser>) {
        const oldUser = toJS(this.user);
        set(this.user, { ...data });
        try {
            yield Users.update(data);
        } catch (_e) {
            set(this.user, { ...oldUser });
        }
    });

    constructor(user: ProfileUser, recentComments: number[]) {
        this.user = observable.object(user);
        this.recentComments = recentComments;
        this.userKind =
            user.capabilities !== undefined ? UserKind.OWNER : UserKind.VISITOR;
    }
}
