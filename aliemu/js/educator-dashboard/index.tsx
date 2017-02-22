import { useStrict } from 'mobx';
import * as React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import * as ReactDOM from 'react-dom';
import { EducatorDashboard } from './components/EducatorDashboard';

useStrict(true);

ReactDOM.render(
    <EducatorDashboard />,
    document.getElementById('educator-dashboard'),
);
