<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Nouvelle demande de devis</title>
</head>
<body style="font-family: Arial, sans-serif; color: #061f49; line-height: 1.6;">
    <h1 style="font-size: 20px;">Nouvelle demande de devis</h1>
    <p><strong>Client :</strong> {{ $quoteRequest->full_name }}</p>
    <p><strong>Téléphone :</strong> {{ $quoteRequest->phone }}</p>
    <p><strong>Email :</strong> {{ $quoteRequest->email }}</p>
    <p><strong>Type de projet :</strong> {{ $quoteRequest->project_type }}</p>
    <p><strong>Budget :</strong> {{ $quoteRequest->budget }}</p>
    <p><strong>Projet :</strong> {{ $quoteRequest->project_title }}</p>
    <p><strong>Message :</strong></p>
    <p>{!! nl2br(e($quoteRequest->message)) !!}</p>
</body>
</html>
