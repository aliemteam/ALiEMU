// tslint:disable:no-var-requires
require('ts-node/register');
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
