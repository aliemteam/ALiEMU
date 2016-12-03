<?php

/*
Available Script Handles (updated 7/7/16)
----------------------------------------
about-nav
abt_frontend_js
aliemu-vendors
comment-reply
divi-custom-script
divi-fitvids
educator-dashboard
et-builder-modules-script
et-jquery-touch-mobile
jquery-masonry
magnific-popup
masonry
nav-helper
particles-home
particlesjs
toastr
um_minified
um_recaptcha
waypoints
wp-embed

Available Style Handles (updated 7/7/16)
----------------------------------------
abt_frontend_styles
admin-bar
bootstrap-nav-css
child-style
dashicons
divi-fonts
et-gf-lato
et-shortcodes-css
et-shortcodes-responsive-css
jquery-dropdown-css
learndash_style
learndash_template_style_css
magnific-popup
open-sans
parent-style
sfwd_front_css
tablepress-default
toastr-css
um-recaptcha
wpProQuiz_front_style

*/

/**
 * Calls the ScriptLoader class at the wp_enqueue_scripts hook.
 * @return void
 */
function callScriptLoader() {
    new ScriptLoader(strtok($_SERVER["REQUEST_URI"], '?'), $_SERVER['QUERY_STRING']);
}
add_action('wp_enqueue_scripts', 'callScriptLoader', 500);


/**
 * Master class to load and unload all scripts / styles
 */
class ScriptLoader {

    private $scripts;
    private $styles;

    private $lessonPageStyles = [
        'abt_frontend_styles',
        'et-shortcodes-css',
        'tablepress-default',
    ];

    private $lessonPageScripts = [
        'abt_frontend_js',
        'et-builder-modules-script',
    ];

    /**
     * ScriptLoader constructor
     *
     * Constructs the loadable scripts/styles into arrays and calles the script
     *   delegator.
     * @param string $request Server request string
     * @param string $query   Server query string
     */
    public function __construct($request, $query) {
        global $current_user, $ROOT_URI, $TEMPLATE_URI;

        $this->scripts = [
            'about-nav' => ['about-nav', $ROOT_URI . '/vendor/about-nav.js', ['jquery'], false, true],
            'aliemu-vendors' => ['aliemu-vendors', $ROOT_URI . '/vendor/vendor.bundle.js', [], false, false],
            'educator-dashboard' => ['educator-dashboard', $ROOT_URI . '/features/dashboards/educator-dashboard/index.js', [/*'aliemu-vendors'*/], false, true],
            'nav-helper' => ['nav-helper', $ROOT_URI . '/js/nav-helper.js', [], false, true],
            'particles-home' => ['particles-home', $ROOT_URI . '/js/particles-home.js', ['particlesjs'], false, true],
            'particlesjs' => ['particlesjs', 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'],
            'toastr' => ['toastr', 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js', [], '2.1.2', true],
        ];

        $this->styles = [
            'bootstrap-nav-css' => ['bootstrap-nav-css', $ROOT_URI .'/vendor/side-nav.css'],
            'child-style' => ['child-style', $ROOT_URI  . '/style.css', ['parent-style']],
            'parent-style' => ['parent-style', $TEMPLATE_URI . '/style.css'],
            'toastr-css' => ['toastr-css', 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css', false, '2.1.2'],
        ];
        $this->delegate($request, $query, $current_user);
    }

    /**
     * Master delegator for the script loader.
     *
     * Loads/Unloads scripts and styles based on the current page.
     * @param  string $req   Server request string
     * @param  string $query Server query string
     * @param  object $user  Current WordPress user
     * @return void
     */
    private function delegate($req, $query, $user) {
        // Always load these
        $load = [
            ['nav-helper'],
            ['parent-style', 'child-style'],
        ];
        // Always unload these
        $unload = [
            ['divi-fitvids', 'waypoints', 'magnific-popup'],
            ['wpProQuiz_front_style', 'magnific-popup'],
        ];

        // Not learndash pages
        if (!is_singular(['sfwd-courses', 'sfwd-quiz', 'sfwd-lessons', 'sfwd-topic'])) {
            // FIXME: Convert back when we get out of siteground
            // array_push($unload[0], ...$this->lessonPageScripts);
            // array_push($unload[1], ...$this->lessonPageStyles);
            foreach($this->lessonPageScripts as $script) {
                $unload[0][] = $script;
            }
            foreach($this->lessonPageStyles as $style) {
                $unload[0][] = $style;
            }
        }

        switch ($req) {
            case '/':
            case '/faculty-start/':
                array_push($load[0], 'particlesjs', 'particles-home');
                break;
            case '/about/':
                array_push($load[0], 'about-nav');
                array_push($load[1], 'bootstrap-nav-css');
                break;
            // Ultimate Member Pages / Tabs
            case "/user/" . strtolower($user->user_login) . "/":
                switch ($query) {
                    case '':
                    case 'profiletab=main':
                        array_push($load[0], 'toastr');
                        array_push($load[1], 'toastr-css');
                        break;
                    case 'profiletab=edudash':
                        array_push($load[0], 'aliemu-vendors');
                        array_push($load[0], 'educator-dashboard');
                        break;
                }
                break;
        }

        // FIXME: Convert back to this when we ditch siteground
        // $this->load(...$load);
        // $this->unload(...$unload);
        $this->load($load[0], $load[1]);
        $this->unload($unload[0], $unload[1]);
    }

    /**
     * Helper function that loads scripts/styles from an array of handles.
     * @param  array $scripts Array of script handles.
     * @param  array $styles  Array of style handles.
     * @return void
     */
    private function load($scripts, $styles) {
        foreach(array_unique($styles) as $style) {
            // FIXME: Convert back when we ditch siteground
            // wp_enqueue_style(...$this->styles[$style]);
            call_user_func_array('wp_enqueue_style', $this->styles[$style]);
        }
        foreach(array_unique($scripts) as $script) {
            // FIXME: Convert back when we ditch siteground
            // wp_enqueue_script(...$this->scripts[$script]);
            call_user_func_array('wp_enqueue_script', $this->scripts[$script]);
        }
    }

    /**
     * Helper function that unloads scripts/styles from an array of handles.
     * @param  array $scripts Array of script handles.
     * @param  array $styles  Array of style handles.
     * @return void
     */
    private function unload($scripts, $styles) {
        foreach(array_unique($scripts) as $script) {
            wp_dequeue_script($script);
        }
        foreach(array_unique($styles) as $style) {
            wp_dequeue_style($style);
        }
    }

}


/**
 * Adds 'async' and 'defer' tags to scripts as needed
 * @param  string $tag The entire script tag (eg <script ...>)
 * @return string The entire script tag.
 */
function scriptAsyncDefer($tag) {

    preg_match('/\/([A-Za-z0-9-]+)(?:\.min)?\.js\?/', $tag, $scriptName);
    if (!$scriptName) return $tag;

    $asyncScripts = [
        'particles',
    ];

    $deferScripts = [];

    if (in_array($scriptName[1], $asyncScripts)) {
        return str_replace(' src', ' async src', $tag);
    }

    if (in_array($scriptName[1], $deferScripts)) {
        return str_replace(' src', ' defer src', $tag);
    }

    return $tag;
}
add_filter('script_loader_tag', 'scriptAsyncDefer', 10);
