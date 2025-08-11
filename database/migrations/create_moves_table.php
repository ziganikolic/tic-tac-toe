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
            $table->char('player', 1);
            $table->unsignedTinyInteger('mini_row');
            $table->unsignedTinyInteger('mini_col');
            $table->unsignedTinyInteger('cell_row');
            $table->unsignedTinyInteger('cell_col');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('moves');
    }
};

