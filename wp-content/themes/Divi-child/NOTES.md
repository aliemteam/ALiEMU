## Various Notes

### Stuff added to Divi theme (will need to add every update)

File | Location | Description
-----|----------|------------
`/includes/builder/main-modules.php`| Just under the `wp_mail` function on line 9608 | Adds hook so we can send emails to slack (be sure to also comment out the `wp_mail` function above)

```php
<?php
do_action('slack_email_hook', array(
    'name' => $contact_name,
    'email' => $contact_email,
    'message' => stripslashes( wp_strip_all_tags( $message_pattern ) ),
));
```
