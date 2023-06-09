import User from "@modules/user/domain/entity/User";

class UserPresenter {
    static createUserSession(user: User, token: string) {
        return {
            user: {
                id: user.id,
                name: user.name
            },
            token
        }
    }
}

export default UserPresenter;