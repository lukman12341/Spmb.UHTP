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
        Schema::table('biodatas', function (Blueprint $table) {
            $table->string('tinggi_badan')->nullable();
            $table->string('golongan_darah')->nullable();
            $table->string('buta_warna')->nullable();
            $table->string('visus')->nullable();
            $table->string('tekanan_darah')->nullable();
            $table->text('riwayat_penyakit')->nullable();
            $table->text('keterangan_kesehatan')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('biodatas', function (Blueprint $table) {
            $table->dropColumn(['tinggi_badan', 'golongan_darah', 'buta_warna', 'visus', 'tekanan_darah', 'riwayat_penyakit', 'keterangan_kesehatan']);
        });
    }
};
