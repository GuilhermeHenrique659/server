import IEntity from "@common/database/repository/types/IEntity";
import IQueryBuilder from "./IQueryBuilder";
import { relationType } from "./types/RelationTypes";

interface IDataSource<T extends IEntity> {
    store(entity: T): Promise<T>;
    createRelationshipt(from: T, relation: string, to: IEntity): Promise<void>;
    findOne(attribute: Partial<T>, relation?: relationType<T>[]): Promise<T | undefined>;
    create(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    getQueryBuilder(): IQueryBuilder;
}

export default IDataSource;