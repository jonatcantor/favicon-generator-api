<?php
if(!isset($_ENV['APP_PRODUCTION'])) {
  require_once(__DIR__ . '/../vendor/autoload.php');
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
  $dotenv->load();
}

header('Access-Control-Allow-Origin: ' . $_ENV['APP_ORIGIN']);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if(strtoupper($_SERVER['REQUEST_METHOD']) === 'OPTIONS') {
  http_response_code(200);
  return;
}

if(strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST') {
  http_response_code(404);
  echo json_encode(['error' => 'Image not found']);

  return;
}

$jsonData = json_decode(file_get_contents('php://input'));
$imageData = explode(',', $jsonData->image);

$image = ImageCreateFromString(base64_decode($imageData[1]));
$image = ImageScale($image, 64, 64);

ImageSaveAlpha($image, true);

ob_start();
ImagePng($image);
$imageData = ob_get_contents();
ob_end_clean();

http_response_code(200);
echo json_encode(['image' => 'data:image/png;base64,' . base64_encode($imageData)]);
?>
