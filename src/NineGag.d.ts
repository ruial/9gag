import { Post } from "./Post";
export declare class NineGag {
    private posts;
    private static URL;
    private static COMMENTS_URL;
    static OUTPUT_FOLDER: string;
    static MEDIA_FOLDER: string;
    static STATIC_FOLDER: string;
    static OUTPUT_FILE: string;
    static TEMPLATE_FILE: string;
    static STATIC_RESOURCES: string;
    constructor();
    getPosts(): Post[];
    addPost(post: Post): void;
    readPosts(maxPages: number, section?: string, comments?: boolean): Promise<void>;
    readComments(post: Post): Promise<void>;
    writePage(outputFolder?: string): Promise<{}>;
    private cacheFiles(outputFolder);
    private cache(url, outputFolder);
    private validatePost(post);
}
