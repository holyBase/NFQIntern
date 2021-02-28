<?php

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type');

include_once('../core/initialize.php');

$student = new Student($db);

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->project_id) &&
    !empty($data->student_fullname)) {

        $student->project_id = $data->project_id;
        $student->student_fullname = $data->student_fullname;

        if ($student->create()) {
            http_response_code(201);
            return json_encode(
                array('message' => 'Student created')
            );
        } else {
            http_response_code(503);

            return json_encode(
                array('message' => 'Student not created')
            );
        }
    } else {
        http_response_code(400);

        return json_encode(array('message' => 'Unable to create student. Data is incomplete'));
    }



