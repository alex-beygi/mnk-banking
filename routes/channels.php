<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('user.{id}', function () {
    return true; // <- Always authorize anyone
});