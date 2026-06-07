<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Nouveau message de contact</title>
</head>
<body style="font-family: Arial, sans-serif; color: #061f49; line-height: 1.6;">
    <h1 style="font-size: 22px;">Nouveau message de contact</h1>
    <p><strong>Nom complet :</strong> {{ $contactMessage->full_name }}</p>
    <p><strong>Telephone :</strong> {{ $contactMessage->phone }}</p>
    <p><strong>Email :</strong> {{ $contactMessage->email }}</p>
    <p><strong>Sujet :</strong> {{ $contactMessage->subject }}</p>
    <p><strong>Message :</strong></p>
    <p>{!! nl2br(e($contactMessage->message)) !!}</p>
</body>
</html>
