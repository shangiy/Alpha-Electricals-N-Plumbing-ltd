<?php
$consumerKey = 'YourConsumerKey';
$consumerSecret = 'YourConsumerSecret';
$credentials = base64_encode($consumerKey . ':' . $consumerSecret);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials');
curl_setopt($curl, CURLOPT_HTTPHEADER, ['Authorization: Basic ' . $credentials]);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($curl);
curl_close($curl);

echo $response;
?>
