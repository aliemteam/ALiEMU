import { render } from '@wordpress/element';

import MessageHub from 'components/message-hub';
import Dashboard from 'dashboard/dashboard';

render(
    <MessageHub>
        <Dashboard />
    </MessageHub>,
    document.getElementById('content'),
);
