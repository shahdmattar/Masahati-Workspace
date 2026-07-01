<?php

require_once "../config/jwt.php";
require_once "../helpers/response.php";

class AuthMiddleware
{
    // Check logged in user
    public static function user()
    {
        $headers = getallheaders();

        // Check Authorization header
        if (!isset($headers['Authorization'])) {

            response(
                false,
                "No token provided",
                null,
                "NO_TOKEN",
                401
            );
        }

        // Remove Bearer from token
        $token = str_replace(
            "Bearer ",
            "",
            $headers['Authorization']
        );

        $jwt = new JwtHandler();

        // Validate token
        $decoded = $jwt->validate($token);

        if (!$decoded) {

            response(
                false,
                "Invalid or expired token",
                null,
                "INVALID_TOKEN",
                401
            );
        }

        // Return user data
        return $decoded->data;
    }

    // Role authorization
    public static function allowRoles($roles = [])
    {
        $user = self::user();

        if (!in_array($user->role, $roles)) {

            response(
                false,
                "Access denied",
                null,
                "FORBIDDEN",
                403
            );
        }

        return $user;
    }
}
