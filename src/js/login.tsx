import React from 'react';
import { render } from 'react-dom';

import MessageHub from 'components/message-hub/';
import Login from 'login/index';

render(
    <MessageHub>
        <Login />
    </MessageHub>,
    document.getElementById('login-root'),
);
