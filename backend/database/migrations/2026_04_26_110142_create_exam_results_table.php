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
        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('registration_id')->constrained('registrations')->onDelete('cascade');
            $table->string('kode_periode');
            $table->integer('total_score');
            $table->string('status_kelulusan'); // lulus, tidak lulus, cadangan
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->foreign('kode_periode')->references('kode_periode')->on('periodes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_results');
    }
};
