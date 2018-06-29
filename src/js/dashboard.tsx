import { configure } from 'mobx';
import React from 'react';
import { render } from 'react-dom';

import Dashboard from 'dashboard/dashboard';

configure({ enforceActions: true });

render(<Dashboard />, document.getElementById('content'));
