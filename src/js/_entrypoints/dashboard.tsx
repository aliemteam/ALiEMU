import { configure } from 'mobx';
import * as React from 'react';
import { render } from 'react-dom';

import Dashboard from 'dashboard/';

configure({ enforceActions: true });

render(<Dashboard />, document.getElementById('content'));
