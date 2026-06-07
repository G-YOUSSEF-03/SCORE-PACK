<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactMessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_message_endpoint_saves_message(): void
    {
        $response = $this->postJson('/api/contact/messages', [
            'full_name' => 'Test Contact',
            'phone' => '+212 6 11 22 33 44',
            'email' => 'test.contact@example.com',
            'subject' => 'Test contact form',
            'message' => 'Message de test depuis Laravel.',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.full_name', 'Test Contact')
            ->assertJsonPath('data.is_read', false);

        $this->assertDatabaseHas(ContactMessage::class, [
            'full_name' => 'Test Contact',
            'phone' => '+212 6 11 22 33 44',
            'email' => 'test.contact@example.com',
            'subject' => 'Test contact form',
            'is_read' => false,
        ]);
    }

    public function test_admin_contact_messages_endpoint_returns_stats_and_messages(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);

        ContactMessage::create([
            'full_name' => 'Unread Contact',
            'phone' => '+212 6 11 22 33 44',
            'email' => 'unread@example.com',
            'subject' => 'Unread subject',
            'message' => 'Unread message',
            'is_read' => false,
        ]);

        ContactMessage::create([
            'full_name' => 'Read Contact',
            'phone' => '+212 6 55 66 77 88',
            'email' => 'read@example.com',
            'subject' => 'Read subject',
            'message' => 'Read message',
            'is_read' => true,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/contact-messages');

        $response->assertOk()
            ->assertJsonPath('stats.total', 2)
            ->assertJsonPath('stats.unread', 1)
            ->assertJsonPath('stats.read', 1)
            ->assertJsonPath('stats.pending', 1)
            ->assertJsonCount(2, 'messages');
    }

    public function test_admin_can_mark_contact_message_as_read(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $message = ContactMessage::create([
            'full_name' => 'Unread Contact',
            'phone' => '+212 6 11 22 33 44',
            'email' => 'unread@example.com',
            'subject' => 'Unread subject',
            'message' => 'Unread message',
            'is_read' => false,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->patchJson("/api/admin/contact-messages/{$message->id}/read");

        $response->assertOk()
            ->assertJsonPath('data.is_read', true);

        $this->assertTrue($message->fresh()->is_read);
    }

    public function test_admin_can_reply_to_contact_message(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $message = ContactMessage::create([
            'full_name' => 'Reply Contact',
            'phone' => '+212 6 11 22 33 44',
            'email' => 'reply@example.com',
            'subject' => 'Need help',
            'message' => 'Original message',
            'is_read' => false,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->postJson("/api/admin/contact-messages/{$message->id}/reply", [
            'message' => 'Merci pour votre message.',
        ]);

        $response->assertOk()
            ->assertJsonPath('message', 'Reponse envoyee avec succes.');
    }
}
