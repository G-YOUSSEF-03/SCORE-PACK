<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PublicApi\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $message = ContactMessage::create($request->validated() + [
            'is_read' => false,
        ]);

        try {
            $adminEmail = config('mail.admin_email', 'youssefelgourari1@gmail.com');

            Mail::send('emails.contact-message', ['contactMessage' => $message], function ($mail) use ($adminEmail, $message): void {
                $mail->to($adminEmail)
                    ->from(config('mail.from.address'), config('mail.from.name'))
                    ->replyTo($message->email, $message->full_name)
                    ->subject('Nouveau message de contact - '.$message->subject);
            });
        } catch (\Throwable $exception) {
            Log::warning('Contact notification email failed.', [
                'contact_message_id' => $message->id,
                'error' => $exception->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Votre message a ete envoye avec succes.',
            'data' => $message,
        ], 201);
    }
}
