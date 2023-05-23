import IEntity from "@common/database/repository/types/IEntity";
import { v4 as uuidv4 } from 'uuid';

class User implements IEntity {
    public readonly id: string;

    public readonly label: string;

    public name: string;

    public email: string;

    public password: string;

    constructor (props: Omit<User, 'id' | 'label' | keyof User>, id?: string) {
        Object.assign(this, props);

        this.label = 'User';
        if (!id) {
            this.id = uuidv4()
        }
    }
}

export default User;