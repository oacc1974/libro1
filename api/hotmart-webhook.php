<?php
/**
 * Webhook para Hotmart
 * 
 * Este script recibe notificaciones de compras reales desde Hotmart
 * y las registra correctamente en Facebook Conversions API
 */

// Configuración
$access_token = 'EAAJXG5cL45ABPMriDB5ZAQOV9fzqZCHviWb4MQfDAyZCw2tt3R5ZCGGkzLmjJ2Mx4CjUr3zrwPSNifsdkCZCrFh4ZCZAtavS3QUUpl8SDChxvavhln5iN9asqccPOKSQmbqFZCSi5z3l9sbAwQLKyV7gSKp7FUdSYvmVHZAgH9hQZC7WaDEZCvT9H18vPVeiGZCtZChLF3gZDZD';
$pixel_id = '744297021447366';
$api_version = 'v18.0';
$endpoint = "https://graph.facebook.com/{$api_version}/{$pixel_id}/events";
$hotmart_token = 'TU_TOKEN_SECRETO_HOTMART'; // Reemplazar con tu token real de Hotmart

// Configurar registro de eventos
$log_file = __DIR__ . '/../logs/hotmart_webhook.log';
$log_dir = dirname($log_file);
if (!file_exists($log_dir)) {
    mkdir($log_dir, 0755, true);
}

// Función para registrar logs
function log_event($message) {
    global $log_file;
    $date = date('Y-m-d H:i:s');
    $log_message = "[{$date}] {$message}" . PHP_EOL;
    file_put_contents($log_file, $log_message, FILE_APPEND);
}

// Verificar método de solicitud
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    log_event("Error: Método no permitido: " . $_SERVER['REQUEST_METHOD']);
    exit;
}

// Obtener y decodificar los datos JSON enviados
$input = file_get_contents('php://input');
$event = json_decode($input, true);

log_event("Webhook recibido: " . $input);

if (!$event) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    log_event("Error: Datos JSON inválidos");
    exit;
}

// Verificar autenticidad del webhook (ejemplo básico)
$hotmart_signature = isset($_SERVER['HTTP_X_HOTMART_SIGNATURE']) ? $_SERVER['HTTP_X_HOTMART_SIGNATURE'] : '';
if (empty($hotmart_signature)) {
    log_event("Advertencia: No se encontró firma de Hotmart");
    // En producción, podrías rechazar solicitudes sin firma
    // http_response_code(401);
    // echo json_encode(['error' => 'Unauthorized']);
    // exit;
}

// Verificar que es un evento de compra aprobada
if (!isset($event['data']['status']) || $event['data']['status'] !== 'APPROVED') {
    log_event("Ignorando evento: No es una compra aprobada. Estado: " . ($event['data']['status'] ?? 'DESCONOCIDO'));
    http_response_code(200); // Aceptamos el webhook pero no hacemos nada
    echo json_encode(['status' => 'ignored']);
    exit;
}

// Extraer datos de la compra
$purchase_data = [
    'content_name' => 'Haz que te ame siempre',
    'content_type' => 'product',
    'content_ids' => [$event['data']['product']['id'] ?? 'N100494926W'],
    'value' => $event['data']['purchase']['price']['value'] ?? 9.00,
    'currency' => $event['data']['purchase']['price']['currency'] ?? 'USD',
    'transaction_id' => $event['data']['purchase']['transaction'] ?? null
];

// Extraer datos del comprador
$user_data = [
    'email' => hash('sha256', strtolower($event['data']['buyer']['email'] ?? '')),
    'phone' => isset($event['data']['buyer']['phone']) ? hash('sha256', $event['data']['buyer']['phone']) : null,
    'first_name' => isset($event['data']['buyer']['name']) ? hash('sha256', explode(' ', $event['data']['buyer']['name'])[0]) : null,
    'last_name' => isset($event['data']['buyer']['name']) ? hash('sha256', substr(strstr($event['data']['buyer']['name'], ' '), 1)) : null,
    'country' => $event['data']['buyer']['address']['country'] ?? 'mx',
    'city' => isset($event['data']['buyer']['address']['city']) ? strtolower($event['data']['buyer']['address']['city']) : 'ciudad_de_mexico',
    'zip' => $event['data']['buyer']['address']['zipcode'] ?? '01000',
    'external_id' => isset($event['data']['buyer']['id']) ? hash('sha256', $event['data']['buyer']['id']) : null
];

// Generar ID único para el evento
$event_id = 'hotmart_' . ($event['data']['purchase']['transaction'] ?? uniqid()) . '_' . time();

// Preparar los datos para la API de Facebook
$fb_data = [
    'data' => [
        [
            'event_name' => 'Purchase',
            'event_time' => time(),
            'event_id' => $event_id,
            'event_source_url' => 'https://tudominio.com/gracias', // Reemplazar con tu URL real
            'action_source' => 'website',
            'user_data' => $user_data,
            'custom_data' => $purchase_data
        ]
    ],
    'access_token' => $access_token
];

// Enviar los datos a Facebook
$response = sendToFacebook($endpoint, $fb_data);
log_event("Respuesta de Facebook: " . json_encode($response));

// Devolver la respuesta
header('Content-Type: application/json');
echo json_encode(['status' => 'success', 'facebook_response' => $response]);

/**
 * Envía los datos a la API de Facebook
 */
function sendToFacebook($url, $data) {
    $options = [
        'http' => [
            'header' => "Content-type: application/json\r\n",
            'method' => 'POST',
            'content' => json_encode($data),
            'ignore_errors' => true
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    return json_decode($result, true);
}
