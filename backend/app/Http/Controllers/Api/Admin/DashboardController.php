<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Project;
use App\Models\QuoteRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $recentQuotes = QuoteRequest::latest()->take(4)->get();
        $recentMessages = ContactMessage::latest()->take(4)->get();

        return response()->json([
            'data' => [
                'totals' => [
                    'projects' => Project::count(),
                    'quote_requests' => QuoteRequest::count(),
                    'messages' => ContactMessage::count(),
                    'users' => User::count(),
                ],
                'recent_quote_requests' => $recentQuotes,
                'recent_activity' => $this->recentActivity($recentQuotes, $recentMessages),
                'project_category_distribution' => Project::selectRaw('category, COUNT(*) as total')
                    ->groupBy('category')
                    ->orderByDesc('total')
                    ->get(),
            ],
        ]);
    }

    private function recentActivity($quotes, $messages): array
    {
        return $quotes->map(fn (QuoteRequest $quote) => [
            'type' => 'quote_request',
            'title' => 'Nouvelle demande de devis reçue',
            'description' => $quote->project_title,
            'created_at' => $quote->created_at,
        ])->merge($messages->map(fn (ContactMessage $message) => [
            'type' => 'contact_message',
            'title' => 'Nouveau message de contact',
            'description' => $message->subject,
            'created_at' => $message->created_at,
        ]))->sortByDesc('created_at')->take(6)->values()->all();
    }
}
