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
            $table->longText('pas_photo_path')->nullable()->change();
            $table->longText('ktp_path')->nullable()->change();
            $table->longText('ijazah_path')->nullable()->change();
            $table->longText('transkrip_path')->nullable()->change();
            $table->longText('bukti_kesehatan_path')->nullable()->change();
            $table->longText('bukti_registrasi_path')->nullable()->change();
        });

        Schema::table('health_tests', function (Blueprint $table) {
            $table->longText('bukti_kesehatan_path')->nullable()->change();
        });

        Schema::table('payment_confirmations', function (Blueprint $table) {
            $table->longText('bukti_path')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('biodatas', function (Blueprint $table) {
            $table->string('pas_photo_path', 255)->nullable()->change();
            $table->string('ktp_path', 255)->nullable()->change();
            $table->string('ijazah_path', 255)->nullable()->change();
            $table->string('transkrip_path', 255)->nullable()->change();
            $table->string('bukti_kesehatan_path', 255)->nullable()->change();
            $table->string('bukti_registrasi_path', 255)->nullable()->change();
        });

        Schema::table('health_tests', function (Blueprint $table) {
            $table->string('bukti_kesehatan_path', 255)->nullable()->change();
        });

        Schema::table('payment_confirmations', function (Blueprint $table) {
            $table->string('bukti_path', 255)->nullable()->change();
        });
    }
};
