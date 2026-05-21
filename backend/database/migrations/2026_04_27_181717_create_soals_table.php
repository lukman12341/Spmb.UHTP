<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('soals', function (Blueprint $box) {
            $box->id();
            $box->text('pertanyaan');
            $box->text('pilihan_a');
            $box->text('pilihan_b');
            $box->text('pilihan_c');
            $box->text('pilihan_d');
            $box->string('jawaban', 1);
            $box->string('type_soal');
            $box->string('soal_untuk');
            $box->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('soals');
    }
};
