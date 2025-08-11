<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('moves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained('games')->cascadeOnDelete();
            $table->unsignedInteger('move_index');
            $table->unsignedTinyInteger('mini_r');
            $table->unsignedTinyInteger('mini_c');
            $table->unsignedTinyInteger('cell_r');
            $table->unsignedTinyInteger('cell_c');
            $table->enum('by', ['X', 'O']);
            $table->unsignedBigInteger('ts_ms');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('moves');
    }
};

