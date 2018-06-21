import { flow, observable, set, toJS } from 'mobx';

import { Users } from 'utils/api';
import { ICoach, ILearner } from 'utils/types';

export const enum UserKind {
    OWNER = 'owner',
    VISITOR = 'visitor',
}

type ProfileUser = ICoach & ILearner;

export default class UserStore {
    readonly userKind: UserKind;
    user: ProfileUser;

    updateUser = flow(function*(
        this: UserStore,
        data: Partial<ProfileUser>,
    ): IterableIterator<any> {
        const oldUser = toJS(this.user);
        set(this.user, { ...data });
        try {
            yield Users.update(data);
        } catch {
            set(this.user, { ...oldUser });
        }
    });

    constructor(user: ProfileUser) {
        this.user = observable.object(user);
        this.userKind =
            user.capabilities !== undefined ? UserKind.OWNER : UserKind.VISITOR;
    }
}
