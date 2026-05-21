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
        Schema::create('biodatas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained('registrations')->onDelete('cascade');
            
            // Biodata Pribadi
            $table->string('nisn')->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('jenis_kelamin')->nullable();
            $table->string('agama')->nullable();
            $table->text('alamat')->nullable();
            $table->string('kabupaten')->nullable();
            $table->string('provinsi')->nullable();
            $table->string('no_telp')->nullable();
            $table->string('no_hp')->nullable();

            // Asal Sekolah
            $table->string('nama_sekolah')->nullable();
            $table->string('jurusan')->nullable();
            $table->string('tahun_tamat')->nullable();
            $table->string('nilai')->nullable();
            $table->text('alamat_sekolah')->nullable();
            $table->string('kabupaten_sekolah')->nullable();
            $table->string('provinsi_sekolah')->nullable();

            // Biodata Orang Tua
            $table->string('nama_ayah')->nullable();
            $table->string('pekerjaan_ayah')->nullable();
            $table->string('no_hp_ayah')->nullable();
            $table->string('nama_ibu')->nullable();
            $table->string('pekerjaan_ibu')->nullable();
            $table->string('no_hp_ibu')->nullable();
            $table->text('alamat_orang_tua')->nullable();
            $table->string('kabupaten_orang_tua')->nullable();
            $table->string('provinsi_orang_tua')->nullable();

            // File Upload Paths
            $table->string('pas_photo_path')->nullable();
            $table->string('ktp_path')->nullable();
            $table->string('ijazah_path')->nullable();
            $table->string('transkrip_path')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('biodatas');
    }
};
