import { configure } from 'mobx';
import React from 'react';
import { render } from 'react-dom';

import MessageHub from 'components/message-hub/';
import Dashboard from 'dashboard/dashboard';

configure({ enforceActions: 'observed' });

render(
    <MessageHub>
        <Dashboard />
    </MessageHub>,
    document.getElementById('content'),
);
