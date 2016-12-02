import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { EducatorDashboard } from './components/EducatorDashboard';
import 'react-datepicker/dist/react-datepicker.css';

declare const AU_EducatorData: ALiEMU.EducatorDashboard.EducatorData;

useStrict(true);

ReactDOM.render(
    <EducatorDashboard data={AU_EducatorData} />,
    document.getElementById('educator-dashboard'),
);
