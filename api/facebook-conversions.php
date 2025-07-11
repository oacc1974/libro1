<?php
/**
 * Facebook Conversions API Handler
 * 
 * Este script recibe eventos del frontend y los envía a la API de Conversiones de Facebook
 * con datos de usuario mejorados para una mejor atribución de conversiones.
 */

// Configuración
$access_token = 'EAAJXG5cL45ABPMriDB5ZAQOV9fzqZCHviWb4MQfDAyZCw2tt3R5ZCGGkzLmjJ2Mx4CjUr3zrwPSNifsdkCZCrFh4ZCZAtavS3QUUpl8SDChxvavhln5iN9asqccPOKSQmbqFZCSi5z3l9sbAwQLKyV7gSKp7FUdSYvmVHZAgH9hQZC7WaDEZCvT9H18vPVeiGZCtZChLF3gZDZD';
$pixel_id = '744297021447366';
$api_version = 'v18.0';
$endpoint = "https://graph.facebook.com/{$api_version}/{$pixel_id}/events";

// Permitir solicitudes desde nuestro dominio
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Solo aceptar solicitudes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Obtener y decodificar los datos JSON enviados
$input = file_get_contents('php://input');
$event = json_decode($input, true);

if (!$event) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Mejorar los datos del usuario
$event['user_data'] = enhanceUserData($event['user_data']);

// Preparar los datos para la API de Facebook
$data = [
    'data' => [
        [
            'event_name' => $event['event_name'],
            'event_time' => $event['event_time'],
            'event_id' => $event['event_id'],
            'event_source_url' => $event['event_source_url'],
            'action_source' => 'website',
            'user_data' => $event['user_data'],
            'custom_data' => $event['custom_data'] ?? []
        ]
    ],
    'access_token' => $access_token
];

// Enviar los datos a Facebook
$response = sendToFacebook($endpoint, $data);

// Devolver la respuesta
header('Content-Type: application/json');
echo json_encode($response);

/**
 * Mejora los datos del usuario con información adicional
 */
function enhanceUserData($userData) {
    // Obtener la IP del cliente
    $userData['client_ip_address'] = getClientIp();
    
    // Asegurarse de que tenemos el user agent
    if (empty($userData['client_user_agent']) && isset($_SERVER['HTTP_USER_AGENT'])) {
        $userData['client_user_agent'] = $_SERVER['HTTP_USER_AGENT'];
    }
    
    // Añadir datos geográficos basados en IP (si es posible)
    $geoData = getGeoData($userData['client_ip_address']);
    if ($geoData) {
        $userData = array_merge($userData, $geoData);
    }
    
    return $userData;
}

/**
 * Obtiene la dirección IP del cliente
 */
function getClientIp() {
    $ipAddress = '';
    
    if (isset($_SERVER['HTTP_CLIENT_IP'])) {
        $ipAddress = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ipAddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } elseif (isset($_SERVER['HTTP_X_FORWARDED'])) {
        $ipAddress = $_SERVER['HTTP_X_FORWARDED'];
    } elseif (isset($_SERVER['HTTP_FORWARDED_FOR'])) {
        $ipAddress = $_SERVER['HTTP_FORWARDED_FOR'];
    } elseif (isset($_SERVER['HTTP_FORWARDED'])) {
        $ipAddress = $_SERVER['HTTP_FORWARDED'];
    } elseif (isset($_SERVER['REMOTE_ADDR'])) {
        $ipAddress = $_SERVER['REMOTE_ADDR'];
    }
    
    // Si hay múltiples IPs, tomar la primera
    if (strpos($ipAddress, ',') !== false) {
        $ipParts = explode(',', $ipAddress);
        $ipAddress = trim($ipParts[0]);
    }
    
    return $ipAddress;
}

/**
 * Obtiene datos geográficos basados en la IP (simulado)
 */
function getGeoData($ip) {
    // En un entorno real, aquí usarías un servicio de geolocalización
    // Para este ejemplo, devolvemos datos ficticios para no depender de servicios externos
    return [
        'country' => 'mx',
        'city' => 'ciudad_de_mexico',
        'zip' => '01000'
    ];
}

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
    
    // Registrar el resultado para depuración
    error_log('Facebook Conversions API Response: ' . $result);
    
    return json_decode($result, true);
}
