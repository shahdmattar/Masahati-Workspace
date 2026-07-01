<?php

$envPath = __DIR__ . '/../../.env';

if (!file_exists($envPath)) {
    die(".env file not found");
}

$env = parse_ini_file($envPath);

// DB Config
define("DB_HOST", $env["DB_HOST"]);
define("DB_NAME", $env["DB_NAME"]);
define("DB_USER", $env["DB_USER"]);
define("DB_PASS", $env["DB_PASS"]);

// JWT Secret
define("JWT_SECRET", $env["JWT_SECRET"]);

// Base URL for uploads
define("BASE_URL", $env["BASE_URL"]);
