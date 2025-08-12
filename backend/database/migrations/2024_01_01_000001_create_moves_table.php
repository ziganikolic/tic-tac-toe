<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('moves', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('game_id');
            $table->integer('move_index');
            $table->integer('mini_r');
            $table->integer('mini_c');
            $table->integer('cell_r');
            $table->integer('cell_c');
            $table->string('by');
            $table->bigInteger('ts_ms');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('moves');
    }
};
