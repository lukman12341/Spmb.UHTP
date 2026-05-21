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
        Schema::table('soals', function (Blueprint $table) {
            $table->text('pilihan_a')->nullable()->change();
            $table->text('pilihan_b')->nullable()->change();
            $table->text('pilihan_c')->nullable()->change();
            $table->text('pilihan_d')->nullable()->change();
            $table->string('jawaban', 1)->nullable()->change();
            
            if (!Schema::hasColumn('soals', 'kategori')) {
                $table->string('kategori')->nullable()->after('pertanyaan');
            }
            if (!Schema::hasColumn('soals', 'prodi')) {
                $table->string('prodi')->nullable()->after('kategori');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('soals', function (Blueprint $table) {
            // Optional: keep them or drop them
        });
    }
};
