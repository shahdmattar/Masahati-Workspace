<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/env.php';
class JwtHandler
{
    private string $secret;

    public function __construct()
    {
        $this->secret = JWT_SECRET;
    }

    public function generate(array $data): string
    {
        $payload = [
            "iat" => time(),
            "exp" => time() + 3600,
            "data" => $data
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function validate(string $token)
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secret, 'HS256'));
            return $decoded->data;
        } catch (Exception $e) {
            return false;
        }
    }
}
