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
        Schema::create('periodes', function (Blueprint $table) {
            $table->string('kode_periode')->primary();
            $table->string('nama_periode');
            $table->date('mulai_daftar');
            $table->date('batas_daftar');
            $table->date('tgl_ujian')->nullable();
            $table->date('tgl_wawancara')->nullable();
            $table->date('tgl_tes_kesehatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('periodes');
    }
};
