import { render } from '@wordpress/element';

import MessageHub from 'components/message-hub';
import Login from 'login/index';

render(
    <MessageHub>
        <Login />
    </MessageHub>,
    document.getElementById('login-root'),
);
