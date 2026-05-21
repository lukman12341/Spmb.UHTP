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
        Schema::create('formulirs', function (Blueprint $table) {
            $table->string('kode_formulir')->primary();
            $table->string('kode_prodi');
            $table->string('kode_program');
            $table->string('nama_formulir');
            $table->bigInteger('harga');
            $table->timestamps();

            $table->foreign('kode_prodi')->references('kode_prodi')->on('prodis')->onDelete('cascade');
            $table->foreign('kode_program')->references('kode_program')->on('programs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formulirs');
    }
};
