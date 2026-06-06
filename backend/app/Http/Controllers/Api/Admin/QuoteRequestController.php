<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateQuoteRequest;
use App\Models\QuoteRequest;
use Illuminate\Http\JsonResponse;

class QuoteRequestController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => QuoteRequest::latest()->paginate(15),
        ]);
    }

    public function show(QuoteRequest $quoteRequest): JsonResponse
    {
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

    public function destroy(QuoteRequest $quoteRequest): JsonResponse
    {
        $quoteRequest->delete();

        return response()->json(['message' => 'Demande de devis supprimée.']);
    }
}
