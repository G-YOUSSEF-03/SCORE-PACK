<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReplyContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => ContactMessage::latest()->paginate(15),
        ]);
    }

    public function show(ContactMessage $contactMessage): JsonResponse
    {
        if ($contactMessage->status === 'new') {
            $contactMessage->update(['status' => 'read']);
        }

        return response()->json([
            'data' => $contactMessage->load('repliedBy:id,name,email'),
        ]);
    }

    public function reply(ReplyContactMessageRequest $request, ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->update([
            'reply' => $request->validated('reply'),
            'status' => $request->validated('status', 'replied'),
            'replied_by' => $request->user()->id,
            'replied_at' => now(),
        ]);

        return response()->json([
            'message' => 'Réponse enregistrée.',
            'data' => $contactMessage->load('repliedBy:id,name,email'),
        ]);
    }

    public function update(Request $request, ContactMessage $contactMessage): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:new,read,replied,pending'],
        ]);

        $contactMessage->update($data);

        return response()->json([
            'message' => 'Message mis à jour.',
            'data' => $contactMessage,
        ]);
    }

    public function destroy(ContactMessage $contactMessage): JsonResponse
    {
        $contactMessage->delete();

        return response()->json(['message' => 'Message supprimé.']);
    }
}
