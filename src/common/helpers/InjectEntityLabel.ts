import IEntity from "@common/database/datasource/types/IEntity";

function InjectEntityLabel(target: new ({}) => IEntity) {
    target.prototype.label = target.name;
}

export default InjectEntityLabel