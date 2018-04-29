declare namespace WordPress {
    type PostStatus = 'draft' | 'future' | 'pending' | 'private' | 'publish';
    type PostFormat =
        | 'aside'
        | 'audio'
        | 'chat'
        | 'gallery'
        | 'image'
        | 'link'
        | 'quote'
        | 'standard'
        | 'status'
        | 'video';

    interface Headers {
        Link: string;
        'X-WP-Total': number;
        'X-WP-TotalPages': number;
    }

    namespace Supports {
        interface CustomFields {
            meta: any;
        }
        interface Excerpt {
            excerpt: __.DisplayObject;
        }
        interface PageAttributes {
            menu_order: number;
        }
        interface PostFormats {
            format: PostFormat;
        }
    }

    interface BasePost {
        id: number;
        date: string;
        date_gmt: string;
        guid: __.DisplayObject;
        modified: string;
        modified_gmt: string;
        slug: string;
        status: PostStatus;
        type: string;
        link: string;
        title: __.DisplayObject;
        content: __.DisplayObject;
        author: number;
        featured_media: number;
        comment_status: __.OpenClosed;
        ping_status: __.OpenClosed;
        template: string;
        categories: number[];
        tags: number[];
        _links: {
            [linkId: string]: {
                href: string;
                embeddable?: true;
            };
        };
    }

    interface Post
        extends BasePost,
            Supports.CustomFields,
            Supports.Excerpt,
            Supports.PostFormats {}

    interface Term {
        count: number;
        description: string;
        filter: 'raw';
        name: string;
        parent: number;
        slug: string;
        taxonomy: string;
        term_group: number;
        term_id: number;
        term_taxonomy_id: number;
    }

    // "private" definitions here
    namespace __ {
        type OpenClosed = 'open' | 'closed';
        interface DisplayObject {
            rendered: string;
            protected?: boolean;
        }
    }
}
