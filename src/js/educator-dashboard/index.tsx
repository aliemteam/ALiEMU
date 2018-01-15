import { useStrict } from 'mobx';
import * as React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import * as ReactDOM from 'react-dom';
import { EducatorDashboard } from './EducatorDashboard';

declare const AU_EducatorData: ALiEMU.EducatorDashboard.EducatorData;

useStrict(true);

ReactDOM.render(
    <EducatorDashboard data={AU_EducatorData} />,
    document.getElementById('educator-dashboard'),
);
