<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('health_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained('registrations')->onDelete('cascade');
            $table->string('tinggi_badan')->nullable();
            $table->string('golongan_darah')->nullable();
            $table->string('buta_warna')->nullable();
            $table->string('visus')->nullable();
            $table->string('tekanan_darah')->nullable();
            $table->text('riwayat_penyakit')->nullable();
            $table->string('status_kesehatan')->nullable();
            $table->text('keterangan_kesehatan')->nullable();
            $table->string('bukti_kesehatan_path')->nullable();
            $table->timestamps();
        });

        // Opsional: Migrasi data dari tabel biodatas ke health_tests jika ada
        $biodatas = DB::table('biodatas')->whereNotNull('status_kesehatan')->get();
        foreach ($biodatas as $bio) {
            DB::table('health_tests')->insert([
                'registration_id' => $bio->registration_id,
                'tinggi_badan' => $bio->tinggi_badan,
                'golongan_darah' => $bio->golongan_darah,
                'buta_warna' => $bio->buta_warna,
                'visus' => $bio->visus,
                'tekanan_darah' => $bio->tekanan_darah,
                'riwayat_penyakit' => $bio->riwayat_penyakit,
                'status_kesehatan' => $bio->status_kesehatan,
                'keterangan_kesehatan' => $bio->keterangan_kesehatan,
                'bukti_kesehatan_path' => $bio->bukti_kesehatan_path,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down()
    {
        Schema::dropIfExists('health_tests');
    }
};
