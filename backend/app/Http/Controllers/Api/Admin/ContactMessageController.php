<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactMessageController extends Controller
{
    public function index(): JsonResponse
    {
        $total = ContactMessage::count();
        $unread = ContactMessage::where('is_read', false)->count();
        $read = ContactMessage::where('is_read', true)->count();

        $messages = ContactMessage::query()
            ->orderBy('is_read')
            ->latest()
            ->get();

        return response()->json([
            'stats' => [
                'total' => $total,
                'unread' => $unread,
                'read' => $read,
                'pending' => $unread,
            ],
            'messages' => $messages,
        ]);
    }

    public function show(ContactMessage $contactMessage): JsonResponse
    {
        return response()->json([
            'data' => $contactMessage,
        ]);
    }

    public function markAsRead(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->update(['is_read' => true]);

        return response()->json([
            'message' => 'Message marque comme lu.',
            'data' => $contactMessage,
        ]);
    }

    public function reply(Request $request, ContactMessage $contactMessage): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
        ]);

        try {
            Mail::send('emails.contact-reply', [
                'contactMessage' => $contactMessage,
                'replyMessage' => trim(strip_tags($data['message'])),
            ], function ($mail) use ($contactMessage): void {
                $mail->to($contactMessage->email, $contactMessage->full_name)
                    ->from(config('mail.from.address'), config('mail.from.name'))
                    ->subject('Re: '.$contactMessage->subject);
            });
        } catch (\Throwable $exception) {
            Log::warning('Contact reply email failed.', [
                'contact_message_id' => $contactMessage->id,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'Impossible d envoyer la reponse pour le moment.',
            ], 500);
        }

        return response()->json([
            'message' => 'Reponse envoyee avec succes.',
        ]);
    }

    public function destroy(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->delete();

        return response()->json([
            'message' => 'Message supprime.',
        ]);
    }
}
