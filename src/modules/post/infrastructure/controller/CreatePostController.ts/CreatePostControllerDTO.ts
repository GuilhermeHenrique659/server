import Tag from "@modules/tag/domain/entity/Tag";

export type CreatePostControllerDTO = {
    content: string;
    tags?: Tag[]
}