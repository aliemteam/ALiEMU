<?php

class AU_Rest_API {
    public static function init() {
        $self = new self();
        add_action('rest_api_init', array($self, 'register_api'));
    }
    public function register_api() {
        require_once(dirname(__FILE__) . '/user.php');
    }
}

AU_Rest_API::init();
