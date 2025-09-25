<?php

return [
    'default' => env('BROADCAST_CONNECTION', env('ABLY_KEY') ? 'ably' : 'log'),

    'connections' => [
        'ably' => [
            'driver' => 'ably',
            'key' => env('ABLY_KEY', env('PUSHER_APP_KEY')),
        ],

        // Backwards compatible alias so old BROADCAST_CONNECTION=pusher configs still work.
        'pusher' => [
            'driver' => 'ably',
            'key' => env('ABLY_KEY', env('PUSHER_APP_KEY')),
        ],

        'log' => [
            'driver' => 'log',
        ],
    ],
];
