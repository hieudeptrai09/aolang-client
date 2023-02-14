import config from '../../config';
import Home from '../Home';
import QuestionTable from '../Game/component/QuestionTable';
import MaxPoint from '../MaxPoint';
import AddQuestion from '../AddQuestion';
import ExternalLink from '../ExternalLink';
import Instruction from '../Instruction';
import Register from '../Register';
import Confirm from '../Register/Confirm.js';
import LogIn from '../LogIn';
import Account from '../Account';
import Media from '../Media';
import ForgetPassword from '../LogIn/ForgetPassword';
import ResetPassword from '../ResetPassword';
import Contact from '../Home/Contact';
import ChooseTags from '../Game/component/ChooseTags';
import Csqdt from '../Home/Policy/Csqdt';
import Dkdv from '../Home/Policy/Dkdv';

const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.game, component: ChooseTags },
    { path: config.routes.questionsTable, component: QuestionTable },
    { path: config.routes.maxPoint, component: MaxPoint },
    { path: config.routes.addQuestion, component: AddQuestion },
    { path: config.routes.externalLink, component: ExternalLink },
    { path: config.routes.instruction, component: Instruction },
    { path: config.routes.register, component: Register },
    { path: config.routes.confirm, component: Confirm },
    { path: config.routes.login, component: LogIn },
    { path: config.routes.media, component: Media },
    { path: config.routes.account, component: Account },
    { path: config.routes.reset, component: ResetPassword },
    { path: config.routes.forget, component: ForgetPassword },
    { path: config.routes.contact, component: Contact },
    { path: config.routes.csqdt, component: Csqdt },
    { path: config.routes.dkdv, component: Dkdv },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
