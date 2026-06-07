<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceRequest;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $latestUpdate = Service::max('updated_at');

        return response()->json([
            'data' => [
                'stats' => [
                    'total' => Service::count(),
                    'active' => Service::where('is_active', true)->count(),
                    'inactive' => Service::where('is_active', false)->count(),
                    'latest_updated_at' => $latestUpdate,
                ],
                'services' => Service::orderBy('order')->paginate(15),
            ],
        ]);
    }

    public function store(ServiceRequest $request): JsonResponse
    {
        $service = Service::create($this->serviceData($request));

        return response()->json([
            'message' => 'Service créé.',
            'data' => $service,
        ], 201);
    }

    public function show(Service $service): JsonResponse
    {
        return response()->json(['data' => $service]);
    }

    public function update(ServiceRequest $request, Service $service): JsonResponse
    {
        $service->update($this->serviceData($request));

        return response()->json([
            'message' => 'Service mis à jour.',
            'data' => $service,
        ]);
    }

    public function destroy(Service $service): JsonResponse
    {
        $service->delete();

        return response()->json(['message' => 'Service supprimé.']);
    }

    private function serviceData(ServiceRequest $request): array
    {
        $data = $request->validated();
        $data['status'] = $data['is_active'] ? 'active' : 'inactive';

        return $data;
    }
}
