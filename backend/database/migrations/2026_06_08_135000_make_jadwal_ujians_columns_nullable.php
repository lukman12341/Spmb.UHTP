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
        Schema::table('jadwal_ujians', function (Blueprint $table) {
            $table->date('tanggal_ujian')->nullable()->change();
            $table->time('jam_mulai')->nullable()->change();
            $table->time('jam_berakhir')->nullable()->change();
            $table->date('tanggal_registrasi_mulai')->nullable()->change();
            $table->date('tanggal_registrasi_akhir')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jadwal_ujians', function (Blueprint $table) {
            $table->date('tanggal_ujian')->nullable(false)->change();
            $table->time('jam_mulai')->nullable(false)->change();
            $table->time('jam_berakhir')->nullable(false)->change();
            $table->date('tanggal_registrasi_mulai')->nullable(false)->change();
            $table->date('tanggal_registrasi_akhir')->nullable(false)->change();
        });
    }
};
