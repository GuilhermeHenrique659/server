import { HttpMethods } from "@common/emun/HttpMethod";
import RouterConfigurator from "@common/routes/RouterConfigurator";
import IHandleDomain from "@common/types/IHandleDomain";
import UserValidation from "../validation/UserValidation";
import UserControllerFactory from "./controller/UserControllerFactory";
import { userControllerFactory } from "./controller";

class UserRouter implements IHandleDomain {
    private _routerConfigurator: RouterConfigurator;
    private _validator: UserValidation;
    private _controllers: UserControllerFactory

    constructor(router: RouterConfigurator, validator: UserValidation, controllers: UserControllerFactory) {
        this._routerConfigurator = router;
        this._validator = validator
        this._controllers = controllers
    }

    public setUpHandles(): void {
        this._routerConfigurator.prefix = 'user';
        this._routerConfigurator.routesConfig = [
            {
                method: HttpMethods.POST,
                path: '/',
                controller: this._controllers.getCreateUser(),
                middleware: {
                    validator: this._validator.validateCreateUser(),
                },
            },
            {
                method: HttpMethods.POST,
                path: '/login',
                controller: this._controllers.getCreateSession(),
                middleware: {
                    validator: this._validator.validateCreateSession()
                }
            }
        ]
    }
    get handle(): RouterConfigurator  {
        return this._routerConfigurator
    }
}

export const userRouter = new UserRouter(new RouterConfigurator(), new UserValidation(), userControllerFactory)