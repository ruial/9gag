import { Comment } from "./Comment";
export declare class Post {
    id: string;
    title: string;
    image: string;
    video: string;
    private comments;
    private static START_URL;
    static MAX_COMMENTS: number;
    constructor(id: string, title: string, image: string, video?: string);
    getComments(): Comment[];
    addComment(comment: Comment): void;
    url(): string;
}
