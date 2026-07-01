<?php

function response(bool $success, string $message, $data = null, $code = null, $httpStatus = 200)
{
    // Discard any accidental output (PHP warnings/notices printed before
    // this point) so the response body is always pure, valid JSON.
    if (ob_get_level()) {
        ob_end_clean();
    }

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