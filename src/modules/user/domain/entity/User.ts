import IEntity from "@common/database/datasource/types/IEntity";
import InjectEntityLabel from "@common/helpers/InjectEntityLabel";
import Tag from "@modules/tag/domain/entity/Tag";
import { v4 as uuidv4 } from 'uuid';

@InjectEntityLabel
class User implements IEntity {
    public readonly id: string;

    public readonly label: string;

    public name: string;

    public email: string;

    public password: string;

    public tags: Tag[];

    constructor (props: Omit<User, 'id' | 'label'| 'tag' | keyof User>, id?: string) {
        Object.assign(this, props);
        
        if (!id) {
            this.id = uuidv4()
        }
    }
}

export default User;