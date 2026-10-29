<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'fonnte' => [
        'token' => env('FONNTE_TOKEN'),
        'target' => env('FONNTE_TARGET'),
        'endpoint' => env('FONNTE_ENDPOINT', 'https://api.fonnte.com/send'),
        'verify_ssl' => env('CURL_VERIFY_SSL', env('APP_ENV') === 'production'),
    ],

    'instagram' => [
        'enabled' => env('INSTAGRAM_ENABLED', true),
        'mock' => env('INSTAGRAM_MOCK', true),
        'account_id' => env('INSTAGRAM_ACCOUNT_ID', '17841400000000000'),
        'access_token' => env('INSTAGRAM_ACCESS_TOKEN'),
        'verify_ssl' => env('CURL_VERIFY_SSL', env('APP_ENV') === 'production'),
        'default_image' => env('INSTAGRAM_DEFAULT_IMAGE', 'https://raw.githubusercontent.com/jaddu17/capstonepmikp/main/frontend/public/images/pmi-banner.png'),
    ],

    'admin' => [
        'password' => env('ADMIN_PASSWORD', 'pmi2026'),
    ],
];
