<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_project_with_image(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/projects', [
            'title' => 'Complexe residentiel a Casablanca',
            'category' => 'Immobilier',
            'location' => 'Casablanca',
            'status' => 'published',
            'project_image' => UploadedFile::fake()->createWithContent('project.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=')),
            'short_description' => 'Description courte du projet.',
            'detailed_description' => 'Description detaillee du projet.',
            'client' => 'Societe Immobiliere XYZ',
            'project_date' => '2026-06-07',
            'estimated_budget' => '15 000 000 MAD',
            'duration' => '24 mois',
            'slug' => '',
            'meta_title' => 'Complexe residentiel a Casablanca | SCORE PACK',
            'meta_description' => 'Decouvrez notre projet de complexe residentiel a Casablanca.',
            'is_published' => '1',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'Complexe residentiel a Casablanca')
            ->assertJsonPath('data.is_published', true)
            ->assertJsonPath('data.slug', 'complexe-residentiel-a-casablanca');

        $project = Project::firstOrFail();
        $this->assertNotNull($project->image);
        Storage::disk('public')->assertExists($project->image);
    }

    public function test_admin_can_update_project_without_replacing_image(): void
    {
        Storage::fake('public');
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        Storage::disk('public')->put('projects/original.png', 'image-content');

        $project = Project::create([
            'title' => 'Original project',
            'category' => 'Immobilier',
            'location' => 'Casablanca',
            'status' => 'published',
            'image' => 'projects/original.png',
            'short_description' => 'Original short',
            'detailed_description' => 'Original detailed',
            'client' => 'Original client',
            'project_date' => '2026-06-07',
            'estimated_budget' => '10 000 MAD',
            'duration' => '12 mois',
            'slug' => 'original-project',
            'meta_title' => 'Original project | SCORE PACK',
            'meta_description' => 'Original meta description.',
            'is_published' => true,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->postJson("/api/admin/projects/{$project->id}?_method=PUT", [
            'title' => 'Updated project',
            'category' => 'Industrie',
            'location' => 'Tanger',
            'status' => 'draft',
            'short_description' => 'Updated short',
            'detailed_description' => 'Updated detailed',
            'client' => 'Updated client',
            'project_date' => '2026-07-01',
            'estimated_budget' => '20 000 MAD',
            'duration' => '18 mois',
            'slug' => 'updated-project',
            'meta_title' => 'Updated project | SCORE PACK',
            'meta_description' => 'Updated meta description.',
            'is_published' => '0',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.title', 'Updated project')
            ->assertJsonPath('data.image', 'projects/original.png')
            ->assertJsonPath('data.is_published', false);

        Storage::disk('public')->assertExists('projects/original.png');
    }
}
