<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PublicApi\StoreQuoteRequest;
use App\Models\QuoteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class QuoteRequestController extends Controller
{
    public function store(StoreQuoteRequest $request): JsonResponse
    {
        $quoteRequest = QuoteRequest::create($request->validated() + [
            'status' => 'new',
            'is_read' => false,
        ]);

        try {
            $adminEmail = config('mail.admin_email', 'youssefelgourari01@gmail.com');

            Mail::send('emails.quote-request-notification', ['quoteRequest' => $quoteRequest], function ($mail) use ($adminEmail, $quoteRequest): void {
                $mail->to($adminEmail)
                    ->from(config('mail.from.address'), config('mail.from.name'))
                    ->replyTo($quoteRequest->email, $quoteRequest->full_name)
                    ->subject('Nouvelle demande de devis - '.$quoteRequest->project_title);
            });
        } catch (\Throwable $exception) {
            Log::warning('Quote request notification email failed.', [
                'quote_request_id' => $quoteRequest->id,
                'error' => $exception->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Votre demande de devis a ete envoyee.',
            'data' => $quoteRequest,
        ], 201);
    }
}
