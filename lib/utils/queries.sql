-- # of unique programs that have faculty with dashboard access
SELECT COUNT(DISTINCT meta_value) AS programs_with_dashboard_access
FROM wp_usermeta
WHERE user_id IN (
    SELECT user_id
    FROM wp_usermeta
    WHERE meta_key = 'wp_capabilities'
    AND meta_value LIKE '%educator_access%'
)
AND meta_key = 'residency_us_em'

-- # of faculty with dashboard access
SELECT COUNT(*)
FROM wp_usermeta
WHERE user_id IN (
    SELECT user_id
    FROM wp_usermeta
    WHERE meta_key = 'role'
    AND meta_value = 'em-faculty'
)
AND meta_key = 'wp_capabilities'
AND meta_value LIKE '%educator_access%'

-- # of residents enrolled
SELECT COUNT(*)
FROM wp_usermeta
WHERE meta_key = 'role'
AND meta_value = 'em-resident'

-- # of current residents enrolled (non-graduated)
SELECT COUNT(user_id)
FROM (
    SELECT CAST(meta_value AS UNSIGNED) AS grad_year, user_id
    FROM wp_usermeta
    WHERE user_id IN (
        SELECT user_id
        FROM wp_usermeta
        WHERE meta_key = 'role'
        AND meta_value = 'em-resident'
    )
    AND meta_key = 'au_graduation_year'
    AND meta_value IS NOT NULL
) AS year_tbl
WHERE grad_year >= YEAR(CURDATE())

-- # of residency programs enrolled
SELECT COUNT(DISTINCT meta_value) AS enrolled_program_count
FROM wp_usermeta
WHERE meta_key = 'residency_us_em'


-- CATEGORY SPECIFIC QUERIES

-- Get all posts associated with a certain category (wtt.term_id = category id)
SELECT DISTINCT p.*
FROM wp_posts p
    LEFT JOIN wp_postmeta meta ON p.ID = meta.post_id
    LEFT JOIN wp_term_relationships wtr ON (p.ID = wtr.object_id)
    LEFT JOIN wp_term_taxonomy wtt ON (wtr.term_taxonomy_id = wtt.term_taxonomy_id)
WHERE wtt.taxonomy = 'category'
AND term_id = (
    SELECT term_id
    FROM wp_terms wt
    WHERE wt.slug = 'capsules'
)

-- Get the post id of all MODULES of a specific category
SELECT DISTINCT p.ID
FROM wp_posts p
    LEFT JOIN wp_postmeta meta ON p.ID = meta.post_id
    LEFT JOIN wp_term_relationships wtr ON (p.ID = wtr.object_id)
    LEFT JOIN wp_term_taxonomy wtt ON (wtr.term_taxonomy_id = wtt.term_taxonomy_id)
WHERE wtt.taxonomy = 'category'
AND p.post_type = 'sfwd-courses'
AND term_id = (
    SELECT term_id
    FROM wp_terms wt
    WHERE wt.slug = 'air-pro'
)


/**
 * Get the number of completions for all modules of a specific series
 * Note: For count of distinct number of users who completed, drop `DISTINCT`
 *   in the `COUNT()` call.
 */
SELECT COUNT(user_id) FROM wp_learndash_user_activity activity
WHERE activity.activity_status = 1
AND activity.post_id IN (
    SELECT DISTINCT p.ID
    FROM wp_posts p
        LEFT JOIN wp_postmeta meta ON p.ID = meta.post_id
        LEFT JOIN wp_term_relationships wtr ON (p.ID = wtr.object_id)
        LEFT JOIN wp_term_taxonomy wtt ON (wtr.term_taxonomy_id = wtt.term_taxonomy_id)
    WHERE wtt.taxonomy = 'category'
    AND p.post_type = 'sfwd-courses'
    AND term_id = (
        SELECT term_id
        FROM wp_terms wt
        WHERE wt.slug = 'air-pro'
    )
)

-- Number of users who completed modules of a certain CATEGORY who are US EM residents
SELECT COUNT(DISTINCT user_id) FROM wp_usermeta umeta
WHERE umeta.meta_key = 'role'
AND umeta.meta_value = 'em-resident'
AND umeta.user_id IN (
    SELECT DISTINCT user_id FROM wp_learndash_user_activity activity
    WHERE activity.activity_status = 1
    AND activity.post_id IN (
        SELECT DISTINCT p.ID
        FROM wp_posts p
        LEFT JOIN wp_postmeta meta ON p.ID = meta.post_id
        LEFT JOIN wp_term_relationships wtr ON (p.ID = wtr.object_id)
        LEFT JOIN wp_term_taxonomy wtt ON (wtr.term_taxonomy_id = wtt.term_taxonomy_id)
        WHERE wtt.taxonomy = 'category'
        AND p.post_type = 'sfwd-courses'
        AND term_id = (
            SELECT term_id
            FROM wp_terms wt
            WHERE wt.slug = 'air'
        )
    )
)
