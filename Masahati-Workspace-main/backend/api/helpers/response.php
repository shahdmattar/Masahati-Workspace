<?php

function response(bool $success, string $message, $data = null, $code = null, $httpStatus = 200)
{
    http_response_code($httpStatus);

    $res = [
        "success" => $success,
        "message" => $message
    ];

    if ($data !== null) {
        $res["data"] = $data;
    }

    if ($code !== null) {
        $res["code"] = $code;
    }

    echo json_encode($res);
    exit;
}