import { configure } from 'mobx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { EducatorDashboard } from '../educator-dashboard/EducatorDashboard';

import 'react-datepicker/src/stylesheets/datepicker-cssmodules';

declare const AU_EducatorData: ALiEMU.EducatorDashboard.EducatorData;

configure({ enforceActions: true });

ReactDOM.render(
    <EducatorDashboard data={AU_EducatorData} />,
    document.getElementById('educator-dashboard'),
);
