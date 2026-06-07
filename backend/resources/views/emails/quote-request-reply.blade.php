<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Réponse SCORE PACK</title>
</head>
<body style="font-family: Arial, sans-serif; color: #061f49; line-height: 1.6;">
    <p>Bonjour {{ $quoteRequest->full_name }},</p>
    <p>{!! nl2br(e($replyMessage)) !!}</p>
    <p style="margin-top: 24px;">Cordialement,<br>SCORE PACK</p>
</body>
</html>
