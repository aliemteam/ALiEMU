<?php
/**
 * Adds additional meta fields to new LearnDash courses
 *
 * @since 1.0.0
 * @version 0.0.1
 * @author Derek P Sifford
 */

/**
 * Calls the class on only the post edit screens
 */
function call_au_meta_fields() {
    new AU_Meta_Fields();
}

if (is_admin()) {
    add_action('load-post.php', 'call_au_meta_fields');
    add_action('load-post-new.php', 'call_au_meta_fields');
}


/**
 * Main class for the ALiEMU custom meta fields
 */
class AU_Meta_Fields
{

    /**
     * Responsible for initializing WordPress hooks
     *
     * @since 1.0.0
     */
    public function __construct() {
        add_action('add_meta_boxes', array($this, 'add_meta_box'));
        add_action('save_post', array($this, 'save_meta'));
    }

    /**
     * Instantiates the meta box on posts of type 'sfwd-courses'
     *
     * @param string $post_type The defined post type of the current post edit screen
     *
     * @since 1.0.0
     */
    public function add_meta_box($post_type) {
        if ($post_type === 'sfwd-courses') {
            add_meta_box(
                'aliemu_extras',
                'ALiEMU Extras',
                 array($this, 'display_meta_box'),
                'sfwd-courses',
                'advanced',
                'low'
            );
        }
    }


    /**
    * Prints the box content.
    *
    * @param WP_Post $post The object for the current post/page.
    *
    * @since 1.0.0
    */
    public function display_meta_box($post) {

        // Add a nonce field so we can check for it later.
        wp_nonce_field( 'au_save_metabox', 'aliemu_meta_nonce' );

        // Retrieve the existing post meta
        $meta_fields = get_post_meta( $post->ID, '_au-meta', true );

        echo $this->au_generate_meta_field(
            'number',
            'au-recommended-hours',
            'au[recommended_hours]',
            'Recommended III Hours',
            'au-recommended-hours-help',
            'The amount of hours that you recommend students claim for this course.',
            $meta_fields['au-recommended_hours']
        );

    }

    /**
     * Saves the meta data to the mysql database on save
     *
     * @param  string $post_id A string representation of the post ID
     *
     * @since 1.0.0
     */
    public function save_meta($post_id) {

        /**
         * If any of the following are true, exit...
         * 		- The nonce field is not set
         * 		- The nonce field is not valid
         * 		- AUTOSAVE is defined and being performed
         * 		- The current user does not have post edit permission
         * 		- $_POST containing the 'au' meta fields does not exist
         */
        if (   !isset($_POST['aliemu_meta_nonce'])
            || !wp_verify_nonce($_POST['aliemu_meta_nonce'], 'au_save_metabox')
            || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
            || !current_user_can('edit_posts')
            || ! $_POST['au']
        ) {
            return;
        }

        // Sanitize the $_POST fields
        $au_recommended_hours = sanitize_text_field($_POST['au']['recommended_hours']);

        // Retrieve the existing meta
        $meta_fields = get_post_meta( $post_id, '_au-meta', true );

        // Update add the $_POST meta to the meta_fields array
        $meta_fields['au-recommended_hours'] = $au_recommended_hours;

        // Update the postmeta with updated $meta_fields information
        update_post_meta( $post_id, '_au-meta', $meta_fields);

    }

    /**
     * Function to generate a metabox field using the same format as LearnDash
     *
     * @param  string $type           Type of form element (text, textarea, select, number)
     * @param  string $field_id       HTML 'id' for the meta field (and also the form element name)
     * @param  string $field_name     HTML 'name' for the individual form element
     * @param  string $field_label    Label for the meta field
     * @param  string $help_text_id   HTML 'id' for the field help text
     * @param  string $help_text      Help text for the field
     * @param  string $stored_var     The lookup item (associative array) item called from the database
     * @param  array  $field_options  (OPTIONAL) Array of strings used for input options
     *                                	- SELECT: array('option 1', 'option 2', ... )
     *
     * @return string                 Formatted HTML metabox field
     *
     * @since 1.0.1 Edited the input step param to accept half values
     */
    private function au_generate_meta_field($type, $field_id, $field_name,
        $field_label, $help_text_id, $help_text, $stored_var, $field_options = NULL) {

        if ($type === 'select' && $field_options !== NULL) {
            $parsed_options = "<option value='' disabled " . ($stored_var ? "" : "selected") . ">-- Select your option -- </option>";
            foreach ($field_options as $key=>$value) {
                $parsed_options .= '<option ' . ($stored_var === $key ? "selected" : "") . ' value="' . $key . '">' . $value . '</option>' . "\n";
            }
        }

        switch ($type) {
        case 'text':
            $element = "<input type='text' name='$field_name' value='$stored_var' class='large-text' style='margin-top: 8px;' />";
            break;

        case 'textarea':
            $element = "<textarea name='$field_name' rows='2' cols='57' style='width: 100%;'>$stored_var</textarea>";
            break;

        case 'select':
            $element = "<select name='$field_name'>$parsed_options</select>";
            break;

        case 'number':
            $element = "<input type='number' name='$field_name' value='$stored_var' step='0.5' class='large-text' style='margin-top: 8px;' />";
            break;

        default:
            return '';
            break;
        }

        $question_img = plugins_url('sfwd-lms/assets/images/question.png');

        return <<<CONTENT
            <div class="sfwd_input" id="$field_id">
                <span class="sfwd_option_label" style="text-align:right;vertical-align:top;">
                    <a class="sfwd_help_text_link" style="cursor:pointer;" title="Click for Help!" onclick="toggleVisibility('$help_text_id');">
                        <img src="$question_img">
                        <label class="sfwd_label textinput">$field_label</label>
                    </a>
                </span>
                <span class="sfwd_option_input">
                    <div class="sfwd_option_div">
                        $element
                    </div>
                    <div class="sfwd_help_text_div" style="display:none" id="$help_text_id">
                        <label class="sfwd_help_text">$help_text</label>
                    </div>
                </span>
                <p style="clear:left"></p>
            </div>
CONTENT;
    }


}
