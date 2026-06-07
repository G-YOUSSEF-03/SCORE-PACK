<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateQuoteRequest;
use App\Models\QuoteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class QuoteRequestController extends Controller
{
    public function index(): JsonResponse
    {
        $stats = [
            'total' => QuoteRequest::count(),
            'new' => QuoteRequest::where('status', 'new')->count(),
            'in_progress' => QuoteRequest::where('status', 'in_progress')->count(),
            'treated' => QuoteRequest::where('status', 'treated')->count(),
        ];

        return response()->json([
            'data' => [
                'stats' => $stats,
                'requests' => QuoteRequest::latest()->paginate(15),
            ],
        ]);
    }

    public function show(QuoteRequest $quoteRequest): JsonResponse
    {
        if (! $quoteRequest->is_read) {
            $quoteRequest->update(['is_read' => true]);
        }

        return response()->json(['data' => $quoteRequest]);
    }

    public function update(UpdateQuoteRequest $request, QuoteRequest $quoteRequest): JsonResponse
    {
        $quoteRequest->update($request->validated());

        return response()->json([
            'message' => 'Demande de devis mise à jour.',
            'data' => $quoteRequest,
        ]);
    }

    public function markAsRead(QuoteRequest $quoteRequest): JsonResponse
    {
        $quoteRequest->update(['is_read' => true]);

        return response()->json([
            'message' => 'Demande marquee comme lue.',
            'data' => $quoteRequest,
        ]);
    }

    public function updateStatus(Request $request, QuoteRequest $quoteRequest): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(['new', 'in_progress', 'treated'])],
        ]);

        $quoteRequest->update($data);

        return response()->json([
            'message' => 'Statut mis a jour.',
            'data' => $quoteRequest,
        ]);
    }

    public function reply(Request $request, QuoteRequest $quoteRequest): JsonResponse
    {
        $data = $request->validate([
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $subject = $data['subject'] ?: 'Re: '.$quoteRequest->project_title;
        $replyMessage = trim(strip_tags($data['message']));

        try {
            Mail::send('emails.quote-request-reply', [
                'quoteRequest' => $quoteRequest,
                'replyMessage' => $replyMessage,
            ], function ($mail) use ($quoteRequest, $subject): void {
                $mail->to($quoteRequest->email, $quoteRequest->full_name)
                    ->from(config('mail.from.address'), config('mail.from.name'))
                    ->subject($subject);
            });
        } catch (\Throwable $exception) {
            Log::warning('Quote request reply email failed.', [
                'quote_request_id' => $quoteRequest->id,
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

    public function destroy(QuoteRequest $quoteRequest): JsonResponse
    {
        $quoteRequest->delete();

        return response()->json(['message' => 'Demande de devis supprimée.']);
    }
}
