declare namespace WordPress {
    namespace API {
        type Context = 'view' | 'embed' | 'edit';

        interface Links {
            [linkId: string]: [
                {
                    embeddable: true | undefined;
                    href: string;
                }
            ];
        }

        interface Headers {
            Link: string;
            'X-WP-Total': number;
            'X-WP-TotalPages': number;
        }
    }

    /**
     * Avatar URLs for users
     */
    interface AvatarUrls {
        /**
         * Avatar URL with image size of 24 pixels.
         */
        '24': string;
        /**
         * Avatar URL with image size of 48 pixels.
         */
        '48': string;
        /**
         * Avatar URL with image size of 96 pixels.
         */
        '96': string;
        /**
         * Avatar URL with image size of 150 pixels.
         */
        '150': string;
    }

    // Comments{{{

    // prettier-ignore
    type Comment<T extends API.Context = 'view'> =
        T extends 'edit' ? BaseComment :
        T extends 'embed' ? Omit<BaseComment, CommentEditFields | 'date_gmt' | 'post' | 'status' | 'meta'> :
        Omit<BaseComment, CommentEditFields>

    type CommentEditFields = 'author_email' | 'author_ip' | 'author_user_agent';

    interface BaseComment {
        /**
         * The ID of the user object, if author was a user.
         */
        author: number;
        /**
         * Avatar URLs for the object author.
         */
        readonly author_avatar_urls: AvatarUrls;
        /**
         * Email address for the object author.
         */
        author_email: string;
        /**
         * IP address for the object author.
         */
        author_ip: string;
        /**
         * Display name for the object author.
         */
        author_name: string;
        /**
         * URL for the object author.
         */
        author_url: string;
        /**
         * User agent for the object author.
         */
        author_user_agent?: string;
        /**
         * The content for the object.
         */
        content: __.DisplayObject;
        /**
         * The date the object was published, in the site's timezone.
         */
        date: string;
        /**
         * The date the object was published, as GMT.
         */
        date_gmt: string;
        /**
         * Unique identifier for the object.
         */
        readonly id: number;
        /**
         * URL to the object.
         */
        readonly link: string;
        /**
         * Meta fields.
         */
        meta: { [key: string]: any };
        /**
         * The ID for the parent of the object.
         */
        parent: number;
        /**
         * The ID of the associated post object.
         */
        post: number;
        /**
         * State of the object.
         */
        status: string;
        /**
         * Type of Comment for the object.
         */
        readonly type: string;
        _links: {
            [k: string]: {
                embeddable?: true;
                href: string;
            };
        };
        _embedded: {
            author: User[];
            up: Post[];
        };
    }
    // }}}
    // Posts{{{

    type Post = BasePost &
        Supports.CustomFields &
        Supports.Excerpt &
        Supports.PostFormats;

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
            [linkId: string]: Array<{
                href: string;
                embeddable?: true;
            }>;
        };
        _embedded?: {
            author: any[];
            replies: any[];
            'wp:featuredmedia': Media[];
            'wp:term': any[];
        };
    }
    // }}}
    // Media{{{
    interface Media {
        alt_text: string;
        author: number;
        caption: __.DisplayObject;
        date: string;
        id: number;
        link: string;
        media_details: {
            file: string;
            height: number;
            image_meta: {
                aperture: string;
                camera: string;
                caption: string;
                copyright: string;
                created_timestamp: string;
                credit: string;
                focal_length: string;
                iso: string;
                keywords: string[];
                orientation: string;
                shutter_speed: string;
                title: string;
            };
            sizes: {
                [sizeId: string]: {
                    file: string;
                    height: number;
                    mime_type: string;
                    source_url: string;
                    width: number;
                };
            };
            width: number;
        };
        media_type: 'image' | 'file';
        mime_type: string;
        slug: string;
        source_url: string;
        title: __.DisplayObject;
        type: string;
    }
    // }}}
    // Terms{{{

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
    // }}}
    // Users{{{

    // prettier-ignore
    type User<T extends API.Context = 'view'> =
        T extends 'embed' ? Omit<BaseUser, UserEditFields | 'meta'> :
        T extends 'view'  ? Omit<BaseUser, UserEditFields | 'course_progress'> :
        BaseUser;

    type UserEditFields =
        | 'capabilities'
        | 'email'
        | 'extra_capabilities'
        | 'first_name'
        | 'last_name'
        | 'last_login'
        | 'locale'
        | 'nickname'
        | 'roles'
        | 'username';

    interface BaseUser {
        /**
         * Avatar URLs for the user.
         */
        avatar_urls: AvatarUrls;
        /**
         * All capabilities assigned to the user.
         */
        capabilities: { [key: string]: any };
        /**
         * Description of the user.
         */
        description: string;
        /**
         * The email address for the user.
         */
        email: string;
        /**
         * Any extra capabilities assigned to the user.
         */
        extra_capabilities: { [key: string]: any };
        /**
         * First name for the user.
         */
        first_name: string;
        /**
         * Unique identifier for the user.
         */
        id: number;
        /**
         * Last name for the user.
         */
        last_name: string;
        /**
         * Author URL of the user.
         */
        link: string;
        /**
         * Locale for the user.
         */
        locale: 'en_US' | '';
        /**
         * Meta fields.
         */
        meta: { [key: string]: any };
        /**
         * Display name for the user.
         */
        name: string;
        /**
         * The nickname for the user.
         */
        nickname: string;
        /**
         * Registration date for the user.
         */
        registered_date: string;
        /**
         * Roles assigned to the user.
         */
        roles: string[];
        /**
         * An alphanumeric identifier for the user.
         */
        slug: string;
        /**
         * URL of the user.
         */
        url: string;
        /**
         * Login name for the user.
         */
        username: string;

        // ALiEMU Custom Fields

        /**
         * Array of objects describing progress of courses that a user has interacted with.
         */
        course_progress: ReadonlyArray<{
            /**
             * Either a parsable date-time of when the activity was completed or null of it doesn't
             * exist.
             */
            activity_completed: null | string;
            /**
             * Either a parsable date-time of when the activity was started or null of it doesn't exist.
             */
            activity_started: null | string;
            /**
             * A parsable date-time of when the activity was last updated.
             */
            activity_updated: string;
            /**
             * Number of hours awarded for the current course, or 0 if the course is not yet completed.
             */
            hours_awarded: number;
            /**
             * The course ID.
             */
            id: number;
            /**
             * Enum describing the status of the course.
             */
            status: 'COMPLETED' | 'STARTED';
            /**
             * Total number of steps the user has completed.
             */
            steps_completed: number;
            /**
             * Total number of steps the course has.
             */
            steps_total: number;
        }>;

        /**
         * The user's self-defined institutional affiliation
         */
        institution: string;
        /**
         * Numeric ISO date of last login
         */
        last_login: number;
    }
    // }}}

    // "private" definitions here
    namespace __ {
        type OpenClosed = 'open' | 'closed';
        interface DisplayObject {
            rendered: string;
            raw?: string;
            protected?: boolean;
        }
    }
}

// vim: set fdm=marker:
