<?php
require_once(__DIR__ . '/../vendor/autoload.php');

if(!isset($_ENV['APP_PRODUCTION'])) {
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
  $dotenv->load();
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . $_ENV['APP_ORIGIN']);
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
?>
