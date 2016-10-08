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
